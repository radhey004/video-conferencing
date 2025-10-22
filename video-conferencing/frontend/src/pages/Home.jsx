import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogIn, Copy, Check, Clock } from 'lucide-react';
import { useAuthStore } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { copyToClipboard, generateRoomLink, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const Home = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [lobbyEnabled, setLobbyEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentRooms, setRecentRooms] = useState([]);
  const [copiedRoomId, setCopiedRoomId] = useState(null);

  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchRecentRooms();
    }
  }, [user]);

  const fetchRecentRooms = async () => {
    try {
      const { data } = await axiosInstance.get('/rooms/my-rooms');
      setRecentRooms(data.rooms || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axiosInstance.post('/rooms/create', {
        name: roomName || `${user.name}'s Meeting`,
        lobbyEnabled,
      });

      toast.success('Room created successfully!');
      navigate(`/room/${data.room.roomId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (joinRoomId.trim()) {
      // Extract room ID from URL if a full URL is pasted
      let roomId = joinRoomId.trim();
      
      // Check if it's a URL
      if (roomId.includes('room/')) {
        // Extract the room ID from the URL
        const parts = roomId.split('room/');
        roomId = parts[parts.length - 1].split('?')[0].split('#')[0];
      }
      
      if (roomId) {
        setShowJoinModal(false);
        setJoinRoomId('');
        navigate(`/room/${roomId}`);
      } else {
        toast.error('Invalid room ID or link');
      }
    }
  };

  const handleCopyLink = async (roomId) => {
    const link = generateRoomLink(roomId);
    const success = await copyToClipboard(link);
    if (success) {
      setCopiedRoomId(roomId);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopiedRoomId(null), 2000);
    } else {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xl text-gray-600">
            Start or join a meeting to collaborate with your team
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition group"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-primary-100 rounded-full group-hover:bg-primary-200 transition">
                <Plus className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">New Meeting</h3>
                <p className="text-gray-600">Create a new meeting room</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowJoinModal(true)}
            className="p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition group"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-green-100 rounded-full group-hover:bg-green-200 transition">
                <LogIn className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Join Meeting</h3>
                <p className="text-gray-600">Enter a meeting code</p>
              </div>
            </div>
          </button>
        </div>

        {/* Recent Rooms */}
        {recentRooms.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Meetings</h2>
            <div className="grid gap-4">
              {recentRooms.map((room) => (
                <div
                  key={room._id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(room.createdAt)}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          room.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {room.isActive ? 'Active' : 'Ended'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCopyLink(room.roomId)}
                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition"
                        title="Copy link"
                      >
                        {copiedRoomId === room.roomId ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>

                      {room.isActive && (
                        <button
                          onClick={() => navigate(`/room/${room.roomId}`)}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                        >
                          Join
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Meeting</h2>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Name (Optional)
                </label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="input"
                  placeholder={`${user?.name}'s Meeting`}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="lobbyEnabled"
                  checked={lobbyEnabled}
                  onChange={(e) => setLobbyEnabled(e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="lobbyEnabled" className="ml-2 text-sm text-gray-700">
                  Enable waiting room (require host approval)
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn btn-primary"
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Meeting</h2>
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting ID or Link
                </label>
                <input
                  type="text"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value)}
                  className="input"
                  placeholder="Enter meeting ID"
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn btn-primary">
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
