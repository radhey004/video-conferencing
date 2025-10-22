import { useState } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Monitor,
  MoreVertical,
  Users,
  MessageSquare,
  Hand,
  Smile,
  Settings,
} from 'lucide-react';

const ControlPanel = ({
  audioEnabled,
  videoEnabled,
  screenSharing,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onLeaveRoom,
  onEndMeeting,
  onToggleChat,
  onToggleParticipants,
  onRaiseHand,
  onSendReaction,
  showChat,
  showParticipants,
  isRecording,
  onToggleRecording,
  isHost,
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const reactions = ['👍', '👏', '❤️', '😂', '😮', '🎉'];

  const handleReaction = (reaction) => {
    onSendReaction(reaction);
    setShowReactions(false);
  };

  return (
    <div className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleAudio}
              className={`p-3 rounded-full transition ${
                audioEnabled
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
              title={audioEnabled ? 'Mute' : 'Unmute'}
            >
              {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={onToggleVideo}
              className={`p-3 rounded-full transition ${
                videoEnabled
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
              title={videoEnabled ? 'Stop Video' : 'Start Video'}
            >
              {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={onToggleScreenShare}
              className={`p-3 rounded-full transition ${
                screenSharing
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
              title={screenSharing ? 'Stop Sharing' : 'Share Screen'}
            >
              <Monitor className="w-5 h-5" />
            </button>
          </div>

          {/* Center controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onRaiseHand}
              className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition"
              title="Raise Hand"
            >
              <Hand className="w-5 h-5" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowReactions(!showReactions)}
                className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition"
                title="Reactions"
              >
                <Smile className="w-5 h-5" />
              </button>

              {showReactions && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-lg p-2 flex space-x-2 shadow-lg">
                  {reactions.map((reaction) => (
                    <button
                      key={reaction}
                      onClick={() => handleReaction(reaction)}
                      className="text-2xl hover:scale-125 transition"
                    >
                      {reaction}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isHost && onToggleRecording && (
              <button
                onClick={onToggleRecording}
                className={`p-3 rounded-full transition ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
                title={isRecording ? 'Stop Recording' : 'Start Recording'}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-white' : 'bg-red-500'}`} />
                </div>
              </button>
            )}
          </div>

          {/* Right controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleParticipants}
              className={`p-3 rounded-full transition ${
                showParticipants
                  ? 'bg-primary-600 hover:bg-primary-700 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
              title="Participants"
            >
              <Users className="w-5 h-5" />
            </button>

            <button
              onClick={onToggleChat}
              className={`p-3 rounded-full transition ${
                showChat
                  ? 'bg-primary-600 hover:bg-primary-700 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
              title="Chat"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            <button
              onClick={onLeaveRoom}
              className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition"
              title="Leave Meeting"
            >
              <PhoneOff className="w-5 h-5" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowMore(!showMore)}
                className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition"
                title="More Options"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {showMore && (
                <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-lg py-2 min-w-[200px]">
                  <button className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  {isHost && onEndMeeting && (
                    <button 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to end this meeting for everyone?')) {
                          onEndMeeting();
                          setShowMore(false);
                        }
                      }}
                      className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 transition flex items-center space-x-2 border-t border-gray-700 mt-1 pt-3"
                    >
                      <PhoneOff className="w-4 h-4" />
                      <span>End Meeting for All</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
