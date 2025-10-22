# 🎥 Video Conferencing App

A **fully-featured, production-ready** video conferencing application built with modern web technologies. Includes real-time video/audio communication, screen sharing, chat, and advanced meeting controls.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## ✨ Features

### 🎯 Core Features
- ✅ **User Authentication** - Secure JWT-based login/signup
- ✅ **Create/Join Meetings** - Unique room links with UUIDs
- ✅ **Video & Audio Calls** - High-quality WebRTC communication
- ✅ **Screen Sharing** - Share your screen with participants
- ✅ **Real-time Chat** - Instant messaging with chat history
- ✅ **Participant List** - See all connected users
- ✅ **Media Controls** - Toggle audio/video on the fly
- ✅ **Leave/End Meeting** - Graceful disconnect handling

### ⚡ Advanced Features
- ✅ **Lobby System** - Host approval before joining (waiting room)
- ✅ **Raise Hand** - Non-verbal communication feature
- ✅ **Reactions** - Express yourself with emojis (👍 👏 ❤️ 😂 😮 🎉)
- ✅ **Chat History** - Persistent messages stored in MongoDB
- ✅ **Admin Controls** - Kick participants, mute all (host only)
- ✅ **Recording Toggle** - Start/stop meeting recording
- ✅ **Recent Meetings** - Quick access to previous rooms
- ✅ **Responsive UI** - Works seamlessly on desktop, tablet, and mobile
- ✅ **Real-time Notifications** - Toast notifications for all events

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-time**: Socket.io
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcryptjs
- **Validation**: express-validator

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **WebRTC**: Simple Peer
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📦 Installation

### Quick Start (Recommended)

```powershell
# Run the setup script (Windows PowerShell)
.\setup.ps1
```

### Manual Installation

```powershell
# 1. Install root dependencies
npm install

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install

# 4. Return to root
cd ..
```

## 🚀 Running the Application

### Start Everything at Once

```powershell
npm run dev
```

This will start:
- **Backend** on `http://localhost:5000`
- **Frontend** on `http://localhost:5173`

### Or Start Separately

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

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Socket Server**: http://localhost:5000

## 📚 Documentation

- **[Setup Guide](SETUP_GUIDE.md)** - Detailed installation and configuration
- **[User Guide](USER_GUIDE.md)** - Complete user manual with screenshots
- **[Backend README](backend/README.md)** - API documentation and socket events
- **[Frontend README](frontend/README.md)** - Component structure and features

## 📁 Project Structure

```
video-conferencing/
├── backend/                 # Node.js + Express + Socket.io
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth & validation
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API endpoints
│   │   ├── sockets/        # WebRTC signaling
│   │   └── utils/          # Helper functions
│   └── package.json
│
├── frontend/               # React + Vite + Tailwind
│   ├── src/
│   │   ├── api/           # API integration
│   │   ├── components/    # React components
│   │   ├── context/       # State management
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Route pages
│   │   └── utils/         # Helper functions
│   └── package.json
│
├── setup.ps1              # Automated setup script
├── USER_GUIDE.md          # User documentation
├── SETUP_GUIDE.md         # Technical documentation
└── README.md              # This file
```

## 🎮 Usage

### 1. Create Account
1. Visit http://localhost:5173
2. Click "Sign Up"
3. Enter name, email, and password
4. Click "Create Account"

### 2. Create Meeting
1. Click "New Meeting"
2. (Optional) Name your meeting
3. (Optional) Enable waiting room
4. Share the room link with participants

### 3. Join Meeting
1. Click "Join Meeting"
2. Enter meeting ID or paste link
3. Allow camera/microphone permissions
4. Start collaborating!

### 4. Meeting Controls
- **🎤** Toggle microphone
- **📹** Toggle camera
- **🖥️** Share screen
- **💬** Open chat
- **👥** View participants
- **✋** Raise hand
- **😊** Send reactions
- **📞** Leave meeting

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://radheyk0017:video-conferencing@cluster0.zjqpuk9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 🧪 Testing

### Test User Credentials
You can create your own accounts or use these test credentials:
- **Email**: test@example.com
- **Password**: test123

## 📱 Browser Support

- ✅ Chrome (Recommended)
- ✅ Edge
- ✅ Firefox
- ✅ Safari
- ⚠️ Opera (Limited support)

## 🔒 Security Features

- JWT-based authentication
- Password hashing (bcrypt)
- Protected API routes
- Socket authentication
- CORS configuration
- Input validation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- WebRTC for peer-to-peer communication
- Socket.io for real-time features
- MongoDB for data persistence
- React & Vite for the frontend
- Tailwind CSS for styling

## 📞 Support

For issues, questions, or suggestions:
1. Check the [User Guide](USER_GUIDE.md)
2. Review [Setup Guide](SETUP_GUIDE.md)
3. Create an issue on GitHub

## 🎉 Happy Conferencing!

Built with ❤️ using modern web technologies

---

**Star ⭐ this repo if you find it helpful!**
