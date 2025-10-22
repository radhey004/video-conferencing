# Video Conferencing App - Complete Setup Guide

A fully-featured video conferencing application with WebRTC, Socket.io, React, and Node.js.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- Git (optional)

## 🚀 Quick Start

### 1. Install Root Dependencies

```powershell
npm install
```

### 2. Install Backend Dependencies

```powershell
cd backend
npm install
```

### 3. Install Frontend Dependencies

```powershell
cd ../frontend
npm install
```

### 4. Configure Environment Variables

#### Backend (.env)
Already configured in `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://radheyk0017:video-conferencing@cluster0.zjqpuk9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

#### Frontend (.env)
Already configured in `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 5. Start the Application

From the root directory:

```powershell
npm run dev
```

This will start both the backend (port 5000) and frontend (port 5173) concurrently.

Or start them separately:

**Backend:**
```powershell
cd backend
npm run dev
```

**Frontend:**
```powershell
cd frontend
npm run dev
```

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 📁 Project Structure

```
video-conferencing/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js     # Authentication logic
│   │   │   └── roomController.js     # Room management
│   │   ├── middleware/
│   │   │   └── authMiddleware.js     # JWT verification
│   │   ├── models/
│   │   │   ├── User.js               # User schema
│   │   │   ├── Room.js               # Room schema
│   │   │   └── Message.js            # Message schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # Auth endpoints
│   │   │   └── roomRoutes.js         # Room endpoints
│   │   ├── sockets/
│   │   │   └── videoSocket.js        # WebRTC signaling
│   │   ├── utils/
│   │   │   └── tokenUtils.js         # JWT utilities
│   │   ├── app.js                    # Express setup
│   │   └── server.js                 # Entry point
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js      # API configuration
│   │   ├── components/
│   │   │   ├── VideoGrid.jsx         # Video display
│   │   │   ├── ControlPanel.jsx      # Meeting controls
│   │   │   ├── ChatBox.jsx           # Chat interface
│   │   │   ├── ParticipantList.jsx   # Participants
│   │   │   └── Navbar.jsx            # Navigation
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Auth state
│   │   │   └── SocketContext.jsx     # Socket connection
│   │   ├── hooks/
│   │   │   └── usePeerConnection.js  # WebRTC hook
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Dashboard
│   │   │   ├── Room.jsx              # Meeting room
│   │   │   └── Login.jsx             # Authentication
│   │   ├── utils/
│   │   │   └── helpers.js            # Utility functions
│   │   ├── styles/
│   │   │   └── global.css            # Global styles
│   │   ├── App.jsx                   # Main component
│   │   └── main.jsx                  # Entry point
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── package.json
└── README.md
```

## ✨ Features

### Core Features
- ✅ User Authentication (JWT-based)
- ✅ Create Meeting Rooms
- ✅ Join Meetings with Room ID
- ✅ Real-time Video & Audio
- ✅ Screen Sharing
- ✅ Real-time Chat
- ✅ Participant List
- ✅ Mute/Unmute Audio
- ✅ Enable/Disable Video
- ✅ Leave/End Meeting

### Advanced Features
- ✅ Lobby System (Host Approval)
- ✅ Raise Hand
- ✅ Reactions (👍, 👏, ❤️, etc.)
- ✅ Chat History (MongoDB)
- ✅ Admin Controls (Kick, Mute All)
- ✅ Meeting Recording Toggle
- ✅ Recent Meetings List
- ✅ Responsive Design

## 🎯 Usage Guide

### 1. Sign Up / Login
- Navigate to the login page
- Create a new account or login with existing credentials

### 2. Create a Meeting
- Click "New Meeting" on the home page
- Optionally enable the waiting room (lobby)
- Click "Create" to generate a unique room

### 3. Join a Meeting
- Click "Join Meeting" on the home page
- Enter the room ID
- Click "Join"

### 4. During the Meeting

**Basic Controls:**
- 🎤 Toggle microphone
- 📹 Toggle camera
- 🖥️ Share screen
- 📞 Leave meeting

**Advanced Features:**
- 💬 Open chat
- 👥 View participants
- ✋ Raise hand
- 😊 Send reactions
- 🔴 Start/Stop recording (host only)

**Host Controls:**
- Remove participants
- Mute all participants
- Approve/Reject lobby requests

## 🔧 API Endpoints

### Authentication
```
POST   /api/auth/signup      - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user
```

### Rooms
```
POST   /api/rooms/create     - Create new room
GET    /api/rooms/my-rooms   - Get user's rooms
GET    /api/rooms/:roomId    - Get room details
GET    /api/rooms/:roomId/messages - Get chat history
PUT    /api/rooms/:roomId/end - End room
```

## 🔌 Socket Events

### Client → Server
- `join-room` - Join a meeting
- `leave-room` - Leave a meeting
- `send-message` - Send chat message
- `toggle-audio` - Toggle audio state
- `toggle-video` - Toggle video state
- `screen-share-started/stopped` - Screen share control
- `raise-hand` - Raise hand
- `send-reaction` - Send reaction
- `kick-participant` - Remove participant (host)
- `mute-all` - Mute all participants (host)
- `approve-lobby` - Approve lobby request (host)
- `reject-lobby` - Reject lobby request (host)

### Server → Client
- `user-joined` - New participant joined
- `user-left` - Participant left
- `existing-users` - List of current participants
- `chat-message` - New message
- `user-audio-toggle` - Audio state changed
- `user-video-toggle` - Video state changed
- `hand-raised` - Hand raised notification
- `user-reaction` - Reaction received
- `kicked-from-room` - User was removed
- `muted-by-host` - Muted by host

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- Socket.io
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs

### Frontend
- React 18
- Vite
- React Router DOM
- Socket.io Client
- WebRTC (Simple Peer)
- Tailwind CSS
- Zustand (State Management)
- Axios
- Lucide React (Icons)
- React Hot Toast

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected API routes
- Socket authentication
- CORS configuration

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920x1080 and above)
- Laptop (1366x768)
- Tablet (768x1024)
- Mobile (375x667 and above)

## 🐛 Troubleshooting

### Camera/Microphone not working
- Check browser permissions
- Ensure HTTPS (or localhost)
- Check if devices are not used by another app

### Cannot connect to server
- Ensure backend is running on port 5000
- Check firewall settings
- Verify environment variables

### MongoDB connection error
- Verify MongoDB connection string
- Check internet connection
- Ensure MongoDB cluster is active

## 📝 Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Backend: Uses nodemon
- Frontend: Uses Vite HMR

### Debug Mode
Enable verbose logging in browser console for debugging WebRTC connections.

## 🚢 Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use a process manager (PM2)
3. Configure reverse proxy (Nginx)
4. Use HTTPS

### Frontend
1. Run `npm run build`
2. Serve the `dist` folder
3. Configure environment variables
4. Use CDN for static assets

## 📄 License

MIT License

## 👥 Support

For issues and questions:
- Check existing issues
- Create a new issue with details
- Include error logs and screenshots

---

**Enjoy your video conferencing experience! 🎉**
