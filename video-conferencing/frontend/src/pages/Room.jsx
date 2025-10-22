import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAuthStore } from '../context/AuthContext';
import usePeerConnection from '../hooks/usePeerConnection';
import VideoGrid from '../components/VideoGrid';
import ControlPanel from '../components/ControlPanel';
import ChatBox from '../components/ChatBox';
import ParticipantList from '../components/ParticipantList';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { socket, connected } = useSocket();
  const { user } = useAuthStore();

  const [localStream, setLocalStream] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inLobby, setInLobby] = useState(false);
  const [reactions, setReactions] = useState([]);

  const screenStreamRef = useRef(null);
  const hasJoinedRef = useRef(false);
  const { peers, addPeer, removePeer } = usePeerConnection(socket, roomId, localStream);

  useEffect(() => {
    initializeMedia();
    fetchRoomDetails();
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (socket && connected && localStream && roomInfo && !hasJoinedRef.current) {
      hasJoinedRef.current = true;
      joinRoom();
      const cleanupListeners = setupSocketListeners();
      
      // Return the cleanup function from setupSocketListeners
      return () => {
        if (cleanupListeners) {
          cleanupListeners();
        }
        hasJoinedRef.current = false;
      };
    }
  }, [socket, connected, localStream, roomInfo]);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      setLocalStream(stream);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast.error('Failed to access camera/microphone');
      navigate('/');
    }
  };

  const fetchRoomDetails = async () => {
    try {
      const { data } = await axiosInstance.get(`/rooms/${roomId}`);
      setRoomInfo(data.room);
      
      // Fetch chat history
      const { data: chatData } = await axiosInstance.get(`/rooms/${roomId}/messages`);
      setMessages(chatData.messages || []);
      
      setLoading(false);
    } catch (error) {
      toast.error('Room not found');
      navigate('/');
    }
  };

  const joinRoom = () => {
    if (!socket || !localStream) return;

    socket.emit('join-room', {
      roomId,
      peerId: socket.id,
      userName: user?.name || 'Guest',
      avatar: user?.avatar,
    });
  };

  const setupSocketListeners = () => {
    if (!socket) return;

    // User joined
    socket.on('user-joined', ({ socketId, userName, avatar, peerId }) => {
      toast.success(`${userName} joined the meeting`);
      addPeer(socketId, { userName, avatar, peerId, audioEnabled: true, videoEnabled: true });
      setParticipants((prev) => [...prev, { socketId, userName, avatar, audioEnabled: true, videoEnabled: true }]);
    });

    // Existing users
    socket.on('existing-users', ({ users }) => {
      users.forEach((user) => {
        if (user.peerId !== socket.id) {
          addPeer(user.peerId, user);
          setParticipants((prev) => [...prev, user]);
        }
      });
    });

    // User left
    socket.on('user-left', ({ socketId, userName }) => {
      toast(`${userName} left the meeting`);
      removePeer(socketId);
      setParticipants((prev) => prev.filter((p) => p.socketId !== socketId));
    });

    // Meeting ended by host
    socket.on('meeting-ended', () => {
      toast.error('Meeting has been ended by the host');
      cleanup();
      navigate('/');
    });

    // Chat message
    socket.on('chat-message', (message) => {
      setMessages((prev) => {
        // Check if message already exists (by _id or timestamp + message content)
        const exists = prev.some(
          (msg) => 
            (msg._id && msg._id === message._id) ||
            (msg.message === message.message && 
             msg.senderName === message.senderName &&
             Math.abs(new Date(msg.createdAt) - new Date(message.createdAt)) < 1000)
        );
        
        if (exists) {
          return prev;
        }
        
        return [...prev, message];
      });
    });

    // Media toggles
    socket.on('user-audio-toggle', ({ socketId, enabled }) => {
      setParticipants((prev) =>
        prev.map((p) => (p.socketId === socketId ? { ...p, audioEnabled: enabled } : p))
      );
    });

    socket.on('user-video-toggle', ({ socketId, enabled }) => {
      setParticipants((prev) =>
        prev.map((p) => (p.socketId === socketId ? { ...p, videoEnabled: enabled } : p))
      );
    });

    socket.on('user-screen-share', ({ socketId, sharing }) => {
      setParticipants((prev) =>
        prev.map((p) => (p.socketId === socketId ? { ...p, isScreenSharing: sharing } : p))
      );
    });

    // Hand raised
    socket.on('hand-raised', ({ socketId, userName }) => {
      toast(`${userName} raised their hand`, { icon: '✋' });
      setParticipants((prev) =>
        prev.map((p) => (p.socketId === socketId ? { ...p, handRaised: true } : p))
      );
      setTimeout(() => {
        setParticipants((prev) =>
          prev.map((p) => (p.socketId === socketId ? { ...p, handRaised: false } : p))
        );
      }, 5000);
    });

    // Reactions
    socket.on('user-reaction', ({ socketId, userName, reaction }) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setReactions((prev) => [...prev, { id, reaction, userName }]);
      setTimeout(() => {
        setReactions((prev) => prev.filter((r) => r.id !== id));
      }, 3000);
    });

    // Kicked
    socket.on('kicked-from-room', () => {
      toast.error('You have been removed from the meeting');
      handleLeaveRoom();
    });

    // Muted by host
    socket.on('muted-by-host', () => {
      toast('Host muted all participants');
      setAudioEnabled(false);
      if (localStream) {
        localStream.getAudioTracks().forEach((track) => (track.enabled = false));
      }
    });

    // Recording
    socket.on('recording-started', () => {
      toast('Recording started', { icon: '🔴' });
    });

    socket.on('recording-stopped', () => {
      toast('Recording stopped');
    });

    // Lobby
    socket.on('waiting-in-lobby', () => {
      setInLobby(true);
      toast('Waiting for host to let you in...');
    });

    socket.on('lobby-approved', () => {
      setInLobby(false);
      toast.success('You have been admitted to the meeting');
      joinRoom();
    });

    socket.on('lobby-rejected', () => {
      toast.error('Your request to join was denied');
      navigate('/');
    });

    return () => {
      socket.off('user-joined');
      socket.off('existing-users');
      socket.off('user-left');
      socket.off('chat-message');
      socket.off('user-audio-toggle');
      socket.off('user-video-toggle');
      socket.off('user-screen-share');
      socket.off('hand-raised');
      socket.off('user-reaction');
      socket.off('kicked-from-room');
      socket.off('muted-by-host');
      socket.off('recording-started');
      socket.off('recording-stopped');
      socket.off('waiting-in-lobby');
      socket.off('lobby-approved');
      socket.off('lobby-rejected');
    };
  };

  const toggleAudio = () => {
    if (localStream) {
      const newState = !audioEnabled;
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = newState;
      });
      setAudioEnabled(newState);
      socket?.emit('toggle-audio', { roomId, enabled: newState });
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const newState = !videoEnabled;
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = newState;
      });
      setVideoEnabled(newState);
      socket?.emit('toggle-video', { roomId, enabled: newState });
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!screenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always' },
          audio: false,
        });

        screenStreamRef.current = screenStream;

        // Replace video track
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = localStream.getVideoTracks()[0];
        
        if (sender) {
          localStream.removeTrack(sender);
          sender.stop();
        }
        
        localStream.addTrack(videoTrack);

        videoTrack.onended = () => {
          toggleScreenShare();
        };

        setScreenSharing(true);
        socket?.emit('screen-share-started', { roomId });
        toast.success('Screen sharing started');
      } else {
        // Stop screen sharing
        if (screenStreamRef.current) {
          screenStreamRef.current.getTracks().forEach((track) => track.stop());
        }

        // Get camera back
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        });

        const videoTrack = cameraStream.getVideoTracks()[0];
        const oldTrack = localStream.getVideoTracks()[0];
        
        if (oldTrack) {
          localStream.removeTrack(oldTrack);
          oldTrack.stop();
        }
        
        localStream.addTrack(videoTrack);

        setScreenSharing(false);
        socket?.emit('screen-share-stopped', { roomId });
        toast('Screen sharing stopped');
      }
    } catch (error) {
      console.error('Screen share error:', error);
      toast.error('Failed to share screen');
    }
  };

  const handleRaiseHand = () => {
    socket?.emit('raise-hand', { roomId });
    toast('You raised your hand', { icon: '✋' });
  };

  const handleSendReaction = (reaction) => {
    socket?.emit('send-reaction', { roomId, reaction });
  };

  const handleKickParticipant = (targetSocketId) => {
    if (roomInfo?.host?._id === user?._id) {
      socket?.emit('kick-participant', { roomId, targetSocketId });
    }
  };

  const handleToggleRecording = () => {
    if (roomInfo?.host?._id === user?._id) {
      if (!isRecording) {
        socket?.emit('start-recording', { roomId });
        setIsRecording(true);
        toast.success('Recording started');
      } else {
        socket?.emit('stop-recording', { roomId });
        setIsRecording(false);
        toast('Recording stopped');
      }
    }
  };

  const handleLeaveRoom = () => {
    socket?.emit('leave-room', { roomId });
    cleanup();
    navigate('/');
  };

  const handleEndMeeting = async () => {
    try {
      await axiosInstance.put(`/rooms/${roomId}/end`);
      
      // Emit socket event to notify all participants
      socket?.emit('meeting-ended', { roomId });
      
      // Cleanup and navigate
      cleanup();
      navigate('/');
      
      toast.success('Meeting ended for all participants');
    } catch (error) {
      console.error('Error ending meeting:', error);
      toast.error(error.response?.data?.message || 'Failed to end meeting');
    }
  };

  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading room...</p>
        </div>
      </div>
    );
  }

  if (inLobby) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">Waiting in lobby</h2>
          <p className="text-gray-300">The host will let you in soon</p>
        </div>
      </div>
    );
  }

  const isHost = roomInfo?.host?._id === user?._id;

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 relative">
          <VideoGrid
            localStream={localStream}
            peers={peers}
            localVideoEnabled={videoEnabled}
            localAudioEnabled={audioEnabled}
          />

          {/* Reactions Overlay */}
          <div className="absolute top-4 right-4 space-y-2">
            {reactions.map((r) => (
              <div
                key={r.id}
                className="reaction-float text-4xl"
                style={{ position: 'relative' }}
              >
                {r.reaction}
              </div>
            ))}
          </div>

          {/* Room Info */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-4 py-2 rounded-lg">
            <p className="text-white font-medium">{roomInfo?.name}</p>
            {isRecording && (
              <p className="text-red-400 text-sm flex items-center mt-1">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
                Recording
              </p>
            )}
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 md:w-96">
            <ChatBox
              socket={socket}
              roomId={roomId}
              messages={messages}
              onClose={() => setShowChat(false)}
              userName={user?.name}
            />
          </div>
        )}

        {/* Participants Sidebar */}
        {showParticipants && (
          <div className="w-80 md:w-96">
            <ParticipantList
              participants={participants}
              localUser={{
                name: user?.name,
                avatar: user?.avatar,
                audioEnabled,
                videoEnabled,
              }}
              onClose={() => setShowParticipants(false)}
              onKickParticipant={handleKickParticipant}
              isHost={isHost}
            />
          </div>
        )}
      </div>

      {/* Control Panel */}
      <ControlPanel
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
        screenSharing={screenSharing}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleScreenShare={toggleScreenShare}
        onLeaveRoom={handleLeaveRoom}
        onEndMeeting={handleEndMeeting}
        onToggleChat={() => setShowChat(!showChat)}
        onToggleParticipants={() => setShowParticipants(!showParticipants)}
        onRaiseHand={handleRaiseHand}
        onSendReaction={handleSendReaction}
        showChat={showChat}
        showParticipants={showParticipants}
        isRecording={isRecording}
        onToggleRecording={handleToggleRecording}
        isHost={isHost}
      />
    </div>
  );
};

export default Room;
