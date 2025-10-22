# 🎥 Video Conferencing App - Installation & User Guide

## 📦 Installation

### Quick Install (Recommended)

Run this command in PowerShell from the project root:

```powershell
.\setup.ps1
```

### Manual Install

If you prefer manual installation:

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

### Start Both Frontend and Backend Together

```powershell
npm run dev
```

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

### Access Points

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
- **API:** http://localhost:5000/api

## 👤 User Guide

### 1️⃣ Getting Started

#### Create an Account
1. Open http://localhost:5173
2. Click on "Sign Up" tab
3. Enter your name, email, and password (min 6 characters)
4. Click "Create Account"

#### Login
1. Enter your email and password
2. Click "Login"

### 2️⃣ Creating a Meeting

1. Click the **"New Meeting"** button on the home page
2. (Optional) Enter a custom meeting name
3. (Optional) Enable "Waiting Room" for host approval
4. Click **"Create"**
5. You'll be redirected to the meeting room
6. Share the room link or ID with participants

### 3️⃣ Joining a Meeting

#### Option 1: From Home
1. Click **"Join Meeting"** button
2. Enter the meeting ID
3. Click **"Join"**

#### Option 2: From Recent Meetings
1. Find the meeting in "Recent Meetings" section
2. Click **"Join"** button

#### Option 3: Direct Link
1. Paste the meeting link in your browser
2. You'll be redirected to the meeting room

### 4️⃣ Meeting Controls

#### Basic Controls (Bottom Panel)

| Icon | Function | Description |
|------|----------|-------------|
| 🎤 | Microphone | Toggle audio on/off |
| 📹 | Camera | Toggle video on/off |
| 🖥️ | Screen Share | Share your screen |
| ✋ | Raise Hand | Notify others you have something to say |
| 😊 | Reactions | Send emoji reactions |
| 👥 | Participants | View and manage participants |
| 💬 | Chat | Open chat panel |
| 📞 | Leave | Exit the meeting |
| ⋮ | More | Additional options |

#### Host-Only Controls

| Function | Description |
|----------|-------------|
| 🔴 Recording | Start/Stop recording |
| 🚪 Kick | Remove participant |
| 🔇 Mute All | Mute all participants |
| ✅ Approve | Let people in from lobby |
| ❌ Reject | Reject lobby requests |

### 5️⃣ Using Chat

1. Click the **💬 Chat** button
2. Type your message in the input field
3. Press **Enter** or click **Send**
4. Chat history is saved and visible to all participants

### 6️⃣ Managing Participants

#### View Participants
1. Click the **👥 Participants** button
2. See list of all participants
3. Green 🎤 = Mic on, Red 🔇 = Mic off

#### Host Actions
- **Kick Participant**: Click the ❌ button next to their name
- **Mute All**: Click "Mute All" button at the bottom

### 7️⃣ Screen Sharing

1. Click the **🖥️ Screen Share** button
2. Select which screen/window to share
3. Click **"Share"**
4. To stop sharing, click the button again

### 8️⃣ Reactions & Raise Hand

#### Send Reactions
1. Click the **😊 Reactions** button
2. Choose an emoji: 👍 👏 ❤️ 😂 😮 🎉
3. The reaction will appear on screen for 3 seconds

#### Raise Hand
1. Click the **✋ Raise Hand** button
2. All participants will be notified
3. Host can see your raised hand in participants list

### 9️⃣ Lobby System (Waiting Room)

#### For Hosts
When lobby is enabled:
1. You'll receive notifications when someone requests to join
2. Click **✅ Approve** to let them in
3. Click **❌ Reject** to deny entry

#### For Participants
When joining a lobby-enabled meeting:
1. You'll see "Waiting in lobby" screen
2. Wait for host to approve your request
3. You'll automatically join when approved

### 🔟 Recording (Host Only)

1. Click the **🔴 Recording** button
2. Recording status shows on screen
3. Click again to stop recording
4. All participants see recording indicator

## 🎨 UI Features

### Responsive Design
- **Desktop**: Full video grid with sidebar panels
- **Tablet**: Adjusted layout for medium screens
- **Mobile**: Stacked layout with collapsible controls

### Video Grid Layouts
- **1 person**: Full screen
- **2 people**: Side by side
- **3-4 people**: 2x2 grid
- **5-6 people**: 2x3 grid
- **7+ people**: Dynamic grid

### Themes
- Dark mode interface for comfortable viewing
- High contrast controls for accessibility

## ⚙️ Settings & Preferences

### Browser Permissions
On first use, allow:
- ✅ Camera access
- ✅ Microphone access
- ✅ Screen sharing (when needed)

### Recommended Browsers
- ✅ Google Chrome (Recommended)
- ✅ Microsoft Edge
- ✅ Firefox
- ✅ Safari (Mac)

### Network Requirements
- **Minimum**: 1 Mbps upload/download
- **Recommended**: 3+ Mbps for HD video

## 🐛 Troubleshooting

### Camera/Microphone Not Working
1. Check browser permissions
2. Ensure no other app is using the devices
3. Refresh the page
4. Try a different browser

### Cannot Join Meeting
1. Verify the room ID is correct
2. Check if meeting has ended
3. Clear browser cache
4. Check internet connection

### Poor Video Quality
1. Close unnecessary applications
2. Move closer to WiFi router
3. Reduce video quality in settings
4. Ask others to turn off video

### Echo or Feedback
1. Use headphones
2. Ensure only one person has audio on in the same room
3. Reduce speaker volume

## 🔒 Privacy & Security

- All communications are encrypted
- Passwords are hashed and secure
- Room IDs are unique and random
- JWT-based authentication
- Host controls for security

## 💡 Tips & Tricks

1. **Mute When Not Speaking**: Reduces background noise
2. **Use Headphones**: Prevents echo and feedback
3. **Good Lighting**: Improves video quality
4. **Stable Internet**: Use wired connection if possible
5. **Close Other Apps**: Improves performance
6. **Test Before Meeting**: Check audio/video beforehand

## 📞 Support

Having issues? Try these steps:
1. Refresh the page
2. Clear browser cache
3. Check browser console for errors
4. Restart the application
5. Check firewall settings

## 🎯 Keyboard Shortcuts

| Keys | Action |
|------|--------|
| `M` | Toggle mute |
| `V` | Toggle video |
| `C` | Open/close chat |
| `P` | Open/close participants |
| `H` | Raise hand |
| `Esc` | Close modals |

## 📱 Mobile Usage

The app is fully responsive:
- Touch-friendly controls
- Optimized layouts
- Swipe gestures
- Landscape mode support

---

**Enjoy seamless video conferencing! 🎉**

Need help? Check the troubleshooting section or contact support.
