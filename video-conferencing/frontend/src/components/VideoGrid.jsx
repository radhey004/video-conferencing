import { useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, User } from 'lucide-react';

const VideoGrid = ({ localStream, peers, localVideoEnabled, localAudioEnabled }) => {
  const localVideoRef = useRef();
  const peerVideoRefs = useRef({});

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    Object.keys(peers).forEach((socketId) => {
      const peer = peers[socketId];
      if (peerVideoRefs.current[socketId] && peer.stream) {
        peerVideoRefs.current[socketId].srcObject = peer.stream;
      }
    });
  }, [peers]);

  const peersList = Object.entries(peers);
  const totalParticipants = peersList.length + 1;

  const getGridClass = () => {
    if (totalParticipants === 1) return 'grid-cols-1';
    if (totalParticipants === 2) return 'grid-cols-1 md:grid-cols-2';
    if (totalParticipants <= 4) return 'grid-cols-2';
    if (totalParticipants <= 6) return 'grid-cols-2 md:grid-cols-3';
    return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  };

  return (
    <div className={`grid ${getGridClass()} gap-4 w-full h-full p-4 overflow-auto`}>
      {/* Local Video */}
      <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
        {localVideoEnabled ? (
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800">
            <User className="w-24 h-24 text-white opacity-50" />
          </div>
        )}

        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <div className="bg-black bg-opacity-50 px-3 py-1 rounded-full">
            <span className="text-white text-sm font-medium">You</span>
          </div>
          <div className="flex space-x-2">
            {!localAudioEnabled && (
              <div className="bg-red-500 p-1.5 rounded-full">
                <MicOff className="w-4 h-4 text-white" />
              </div>
            )}
            {!localVideoEnabled && (
              <div className="bg-red-500 p-1.5 rounded-full">
                <VideoOff className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Remote Videos */}
      {peersList.map(([socketId, peer]) => (
        <div key={socketId} className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
          {peer.stream ? (
            <video
              ref={(el) => (peerVideoRefs.current[socketId] = el)}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
              <User className="w-24 h-24 text-white opacity-50" />
            </div>
          )}

          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            <div className="bg-black bg-opacity-50 px-3 py-1 rounded-full">
              <span className="text-white text-sm font-medium">
                {peer.userName || 'Guest'}
              </span>
            </div>
            {peer.audioEnabled === false && (
              <div className="bg-red-500 p-1.5 rounded-full">
                <MicOff className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          {peer.isScreenSharing && (
            <div className="absolute top-2 right-2 bg-green-500 px-2 py-1 rounded-full">
              <span className="text-white text-xs font-medium">Presenting</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
