import { useEffect, useRef, useCallback } from 'react';
import Peer from 'simple-peer';

const usePeerConnection = (socket, roomId, localStream) => {
  const peersRef = useRef({});
  const peerInstances = useRef({});

  const createPeer = useCallback(
    (socketId, initiator) => {
      if (peerInstances.current[socketId]) {
        peerInstances.current[socketId].destroy();
      }

      const peer = new Peer({
        initiator,
        trickle: true,
        stream: localStream,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
          ],
        },
      });

      peer.on('signal', (signal) => {
        if (initiator) {
          socket.emit('offer', { offer: signal, to: socketId });
        } else {
          socket.emit('answer', { answer: signal, to: socketId });
        }
      });

      peer.on('stream', (remoteStream) => {
        if (peersRef.current[socketId]) {
          peersRef.current[socketId].stream = remoteStream;
        }
      });

      peer.on('error', (err) => {
        console.error('Peer error:', err);
      });

      peer.on('close', () => {
        if (peerInstances.current[socketId]) {
          delete peerInstances.current[socketId];
        }
      });

      peerInstances.current[socketId] = peer;
      return peer;
    },
    [socket, localStream]
  );

  const addPeer = useCallback(
    (socketId, userInfo) => {
      if (!peersRef.current[socketId]) {
        peersRef.current[socketId] = {
          ...userInfo,
          stream: null,
        };
        createPeer(socketId, true);
      }
    },
    [createPeer]
  );

  const removePeer = useCallback((socketId) => {
    if (peerInstances.current[socketId]) {
      peerInstances.current[socketId].destroy();
      delete peerInstances.current[socketId];
    }
    if (peersRef.current[socketId]) {
      delete peersRef.current[socketId];
    }
  }, []);

  useEffect(() => {
    if (!socket || !localStream) return;

    // Handle offer
    socket.on('offer', ({ offer, from }) => {
      if (!peerInstances.current[from]) {
        const peer = createPeer(from, false);
        peer.signal(offer);
      }
    });

    // Handle answer
    socket.on('answer', ({ answer, from }) => {
      if (peerInstances.current[from]) {
        peerInstances.current[from].signal(answer);
      }
    });

    // Handle ICE candidate
    socket.on('ice-candidate', ({ candidate, from }) => {
      if (peerInstances.current[from]) {
        peerInstances.current[from].signal(candidate);
      }
    });

    return () => {
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
    };
  }, [socket, localStream, createPeer]);

  const updateLocalStream = useCallback((newStream) => {
    Object.values(peerInstances.current).forEach((peer) => {
      if (peer && peer.removeStream && peer.addStream) {
        try {
          peer.removeStream(localStream);
          peer.addStream(newStream);
        } catch (err) {
          console.error('Error updating stream:', err);
        }
      }
    });
  }, [localStream]);

  return {
    peers: peersRef.current,
    addPeer,
    removePeer,
    updateLocalStream,
  };
};

export default usePeerConnection;
