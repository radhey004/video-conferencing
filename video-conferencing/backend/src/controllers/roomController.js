import { v4 as uuidv4 } from 'uuid';
import Room from '../models/Room.js';
import Message from '../models/Message.js';

// @desc    Create a new room
// @route   POST /api/rooms/create
export const createRoom = async (req, res) => {
  try {
    const { name, lobbyEnabled, maxParticipants } = req.body;

    const roomId = uuidv4();

    const room = await Room.create({
      roomId,
      name: name || `${req.user.name}'s Meeting`,
      host: req.user._id,
      settings: {
        lobbyEnabled: lobbyEnabled || false,
        maxParticipants: maxParticipants || 50,
      },
    });

    const populatedRoom = await Room.findById(room._id).populate('host', 'name email avatar');

    res.status(201).json({
      success: true,
      room: populatedRoom,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get room details
// @route   GET /api/rooms/:roomId
export const getRoomDetails = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId }).populate('host', 'name email avatar');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({
      success: true,
      room,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get chat history
// @route   GET /api/rooms/:roomId/messages
export const getChatHistory = async (req, res) => {
  try {
    const { roomId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const messages = await Message.find({ roomId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('sender', 'name avatar');

    res.json({
      success: true,
      messages: messages.reverse(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's rooms
// @route   GET /api/rooms/my-rooms
export const getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      $or: [
        { host: req.user._id },
        { 'participants.user': req.user._id }
      ],
      isActive: true
    })
      .populate('host', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      rooms,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    End room
// @route   PUT /api/rooms/:roomId/end
export const endRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user is host
    if (room.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only host can end the meeting' });
    }

    room.isActive = false;
    await room.save();

    res.json({
      success: true,
      message: 'Room ended successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
