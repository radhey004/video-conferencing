# Frontend for Video Conferencing App

## Features

- User authentication (Login/Signup)
- Create and join meeting rooms
- Real-time video and audio communication
- Screen sharing
- Real-time chat
- Participant list with admin controls
- Raise hand and reactions
- Responsive UI with Tailwind CSS

## Tech Stack

- React 18
- Vite
- React Router DOM
- Socket.io Client
- Simple Peer (WebRTC)
- Axios
- Zustand (State Management)
- Tailwind CSS
- Lucide React (Icons)
- React Hot Toast (Notifications)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

3. Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

## Project Structure

- `/src/api` - API utilities and Axios instance
- `/src/components` - Reusable React components
- `/src/context` - Context providers (Auth, Socket)
- `/src/hooks` - Custom React hooks
- `/src/pages` - Page components
- `/src/utils` - Helper functions
- `/src/styles` - Global styles
