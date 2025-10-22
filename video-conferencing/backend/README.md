# Backend for Video Conferencing App

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

3. Run the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Rooms
- `POST /api/rooms/create` - Create new room (protected)
- `GET /api/rooms/my-rooms` - Get user's rooms (protected)
- `GET /api/rooms/:roomId` - Get room details (protected)
- `GET /api/rooms/:roomId/messages` - Get chat history (protected)
- `PUT /api/rooms/:roomId/end` - End room (protected, host only)

## Socket Events

### Client -> Server
- `join-room` - Join a meeting room
- `leave-room` - Leave a meeting room
- `offer`, `answer`, `ice-candidate` - WebRTC signaling
- `send-message` - Send chat message
- `toggle-audio`, `toggle-video` - Media controls
- `screen-share-started`, `screen-share-stopped` - Screen sharing
- `raise-hand` - Raise hand
- `send-reaction` - Send reaction
- `kick-participant`, `mute-all` - Admin controls
- `start-recording`, `stop-recording` - Recording controls
- `approve-lobby`, `reject-lobby` - Lobby management

### Server -> Client
- `user-joined` - New user joined
- `user-left` - User left
- `existing-users` - List of users in room
- `chat-message` - New chat message
- `user-audio-toggle`, `user-video-toggle` - User media state
- `user-screen-share` - Screen sharing state
- `hand-raised` - User raised hand
- `user-reaction` - User sent reaction
- `kicked-from-room` - User was kicked
- `muted-by-host` - Host muted all
- `recording-started`, `recording-stopped` - Recording state
- `waiting-in-lobby` - User in lobby
- `lobby-approved`, `lobby-rejected` - Lobby response
- `lobby-request` - New lobby request (to host)
