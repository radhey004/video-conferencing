import { X, UserMinus, Mic, MicOff, Hand } from 'lucide-react';

const ParticipantList = ({ participants, localUser, onClose, onKickParticipant, isHost }) => {
  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Participants ({participants.length + 1})
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Local User */}
        <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <img
              src={localUser.avatar}
              alt={localUser.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium text-gray-900">{localUser.name} (You)</p>
              {isHost && (
                <span className="text-xs text-primary-600 font-medium">Host</span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {localUser.audioEnabled ? (
              <Mic className="w-4 h-4 text-green-600" />
            ) : (
              <MicOff className="w-4 h-4 text-red-600" />
            )}
          </div>
        </div>

        {/* Remote Participants */}
        {participants.map((participant) => (
          <div
            key={participant.socketId}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
          >
            <div className="flex items-center space-x-3">
              <img
                src={participant.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.userName)}`}
                alt={participant.userName}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900">{participant.userName}</p>
                {participant.isHost && (
                  <span className="text-xs text-primary-600 font-medium">Host</span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {participant.handRaised && (
                <Hand className="w-4 h-4 text-yellow-500 animate-pulse" />
              )}
              {participant.audioEnabled === false && (
                <MicOff className="w-4 h-4 text-red-600" />
              )}
              {isHost && !participant.isHost && onKickParticipant && (
                <button
                  onClick={() => onKickParticipant(participant.socketId)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition"
                  title="Remove participant"
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Host Controls */}
      {isHost && participants.length > 0 && (
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm font-medium">
            Mute All
          </button>
        </div>
      )}
    </div>
  );
};

export default ParticipantList;
