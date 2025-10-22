import Room from '../models/Room.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { verifyToken } from '../utils/tokenUtils.js';

// Store active connections
const users = new Map(); // socketId -> { userId, roomId, peerId, userName, avatar }
const rooms = new Map(); // roomId -> Set of socketIds

export const initializeSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (token) {
        const decoded = verifyToken(token);
        if (decoded) {
          const user = await User.findById(decoded.id).select('-password');
          socket.user = user;
        }
      }
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join room
    socket.on('join-room', async ({ roomId, peerId, userName, avatar }) => {
      try {
        const room = await Room.findOne({ roomId });
        
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        if (!room.isActive) {
          socket.emit('error', { message: 'Room has ended' });
          return;
        }

        const userId = socket.user?._id?.toString() || 'guest';

        // Check lobby
        if (room.settings.lobbyEnabled && room.host.toString() !== userId) {
          // Add to lobby queue
          const existingInLobby = room.lobbyQueue.find(
            (entry) => entry.user?.toString() === userId
          );

          if (!existingInLobby) {
            room.lobbyQueue.push({
              user: socket.user?._id,
              socketId: socket.id,
            });
            await room.save();
          }

          socket.emit('waiting-in-lobby');
          
          // Notify host
          const hostSocketIds = Array.from(users.entries())
            .filter(([_, userData]) => 
              userData.roomId === roomId && userData.userId === room.host.toString()
            )
            .map(([socketId]) => socketId);

          hostSocketIds.forEach((hostSocketId) => {
            io.to(hostSocketId).emit('lobby-request', {
              userId,
              userName,
              avatar,
              socketId: socket.id,
            });
          });

          return;
        }

        // Join room
        socket.join(roomId);

        // Store user info
        users.set(socket.id, { userId, roomId, peerId, userName, avatar });

        // Track room
        if (!rooms.has(roomId)) {
          rooms.set(roomId, new Set());
        }
        rooms.get(roomId).add(socket.id);

        // Update room participants
        const participantExists = room.participants.some(
          (p) => p.user?.toString() === userId
        );

        if (!participantExists && socket.user) {
          room.participants.push({
            user: socket.user._id,
            socketId: socket.id,
          });
          await room.save();
        }

        // Get all users in room
        const roomUsers = Array.from(rooms.get(roomId) || [])
          .map((sid) => users.get(sid))
          .filter(Boolean);

        // Notify existing users
        socket.to(roomId).emit('user-joined', {
          peerId,
          userId,
          userName,
          avatar,
          socketId: socket.id,
        });

        // Send existing users to new user
        socket.emit('existing-users', { users: roomUsers });

        // System message
        const systemMessage = await Message.create({
          roomId,
          sender: socket.user?._id,
          senderName: 'System',
          message: `${userName} joined the meeting`,
          type: 'system',
        });

        // Send to all users in room (including the user who joined)
        io.to(roomId).emit('chat-message', systemMessage);

        console.log(`User ${userName} joined room ${roomId}`);
      } catch (error) {
        console.error('Join room error:', error);
        socket.emit('error', { message: error.message });
      }
    });

    // Approve lobby request (host only)
    socket.on('approve-lobby', async ({ roomId, socketId }) => {
      try {
        const room = await Room.findOne({ roomId });
        
        if (!room || room.host.toString() !== socket.user?._id?.toString()) {
          return;
        }

        // Remove from lobby queue
        room.lobbyQueue = room.lobbyQueue.filter(
          (entry) => entry.socketId !== socketId
        );
        await room.save();

        // Notify user they're approved
        io.to(socketId).emit('lobby-approved', { roomId });
      } catch (error) {
        console.error('Approve lobby error:', error);
      }
    });

    // Reject lobby request
    socket.on('reject-lobby', async ({ roomId, socketId }) => {
      try {
        const room = await Room.findOne({ roomId });
        
        if (!room || room.host.toString() !== socket.user?._id?.toString()) {
          return;
        }

        room.lobbyQueue = room.lobbyQueue.filter(
          (entry) => entry.socketId !== socketId
        );
        await room.save();

        io.to(socketId).emit('lobby-rejected');
      } catch (error) {
        console.error('Reject lobby error:', error);
      }
    });

    // WebRTC signaling
    socket.on('offer', ({ offer, to }) => {
      socket.to(to).emit('offer', {
        offer,
        from: socket.id,
      });
    });

    socket.on('answer', ({ answer, to }) => {
      socket.to(to).emit('answer', {
        answer,
        from: socket.id,
      });
    });

    socket.on('ice-candidate', ({ candidate, to }) => {
      socket.to(to).emit('ice-candidate', {
        candidate,
        from: socket.id,
      });
    });

    // Chat message
    socket.on('send-message', async ({ roomId, message }) => {
      try {
        const user = users.get(socket.id);
        
        if (!user) return;

        const chatMessage = await Message.create({
          roomId,
          sender: socket.user?._id,
          senderName: user.userName,
          message,
          type: 'text',
        });

        const populatedMessage = await Message.findById(chatMessage._id).populate(
          'sender',
          'name avatar'
        );

        io.to(roomId).emit('chat-message', populatedMessage);
      } catch (error) {
        console.error('Send message error:', error);
      }
    });

    // Media controls
    socket.on('toggle-audio', ({ roomId, enabled }) => {
      socket.to(roomId).emit('user-audio-toggle', {
        socketId: socket.id,
        enabled,
      });
    });

    socket.on('toggle-video', ({ roomId, enabled }) => {
      socket.to(roomId).emit('user-video-toggle', {
        socketId: socket.id,
        enabled,
      });
    });

    socket.on('screen-share-started', ({ roomId }) => {
      socket.to(roomId).emit('user-screen-share', {
        socketId: socket.id,
        sharing: true,
      });
    });

    socket.on('screen-share-stopped', ({ roomId }) => {
      socket.to(roomId).emit('user-screen-share', {
        socketId: socket.id,
        sharing: false,
      });
    });

    // Raise hand
    socket.on('raise-hand', ({ roomId }) => {
      const user = users.get(socket.id);
      if (user) {
        io.to(roomId).emit('hand-raised', {
          socketId: socket.id,
          userName: user.userName,
        });
      }
    });

    // Reactions
    socket.on('send-reaction', ({ roomId, reaction }) => {
      const user = users.get(socket.id);
      if (user) {
        io.to(roomId).emit('user-reaction', {
          socketId: socket.id,
          userName: user.userName,
          reaction,
        });
      }
    });

    // Admin controls
    socket.on('kick-participant', async ({ roomId, targetSocketId }) => {
      try {
        const room = await Room.findOne({ roomId });
        const user = users.get(socket.id);
        
        if (!room || !user) return;

        // Check if user is host
        if (room.host.toString() !== user.userId) {
          return;
        }

        io.to(targetSocketId).emit('kicked-from-room');
        
        const kickedUser = users.get(targetSocketId);
        if (kickedUser) {
          io.to(roomId).emit('participant-kicked', {
            socketId: targetSocketId,
            userName: kickedUser.userName,
          });
        }
      } catch (error) {
        console.error('Kick participant error:', error);
      }
    });

    socket.on('mute-all', async ({ roomId }) => {
      try {
        const room = await Room.findOne({ roomId });
        const user = users.get(socket.id);
        
        if (!room || !user) return;

        if (room.host.toString() !== user.userId) {
          return;
        }

        socket.to(roomId).emit('muted-by-host');
      } catch (error) {
        console.error('Mute all error:', error);
      }
    });

    // Recording
    socket.on('start-recording', ({ roomId }) => {
      socket.to(roomId).emit('recording-started');
    });

    socket.on('stop-recording', ({ roomId }) => {
      socket.to(roomId).emit('recording-stopped');
    });

    // Leave room
    socket.on('leave-room', async ({ roomId }) => {
      await handleUserLeave(socket, roomId, io);
    });

    // Meeting ended by host
    socket.on('meeting-ended', async ({ roomId }) => {
      try {
        // Notify all participants in the room
        socket.to(roomId).emit('meeting-ended');
        
        // Remove all users from the room
        const room = rooms.get(roomId);
        if (room) {
          room.participants.forEach((participant) => {
            users.delete(participant.socketId);
          });
          rooms.delete(roomId);
        }
        
        console.log(`Meeting ${roomId} ended by host`);
      } catch (error) {
        console.error('Error ending meeting:', error);
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      const user = users.get(socket.id);
      if (user) {
        await handleUserLeave(socket, user.roomId, io);
      }
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

// Helper function to handle user leaving
const handleUserLeave = async (socket, roomId, io) => {
  try {
    const user = users.get(socket.id);
    
    if (!user) return;

    // Remove from tracking
    users.delete(socket.id);
    if (rooms.has(roomId)) {
      rooms.get(roomId).delete(socket.id);
      if (rooms.get(roomId).size === 0) {
        rooms.delete(roomId);
      }
    }

    // Update database
    const room = await Room.findOne({ roomId });
    if (room) {
      room.participants = room.participants.filter(
        (p) => p.socketId !== socket.id
      );
      await room.save();

      // System message
      const systemMessage = await Message.create({
        roomId,
        sender: socket.user?._id,
        senderName: 'System',
        message: `${user.userName} left the meeting`,
        type: 'system',
      });

      io.to(roomId).emit('chat-message', systemMessage);
    }

    // Notify others
    socket.to(roomId).emit('user-left', {
      socketId: socket.id,
      userName: user.userName,
    });

    socket.leave(roomId);
  } catch (error) {
    console.error('Handle user leave error:', error);
  }
};

export default initializeSocket;
