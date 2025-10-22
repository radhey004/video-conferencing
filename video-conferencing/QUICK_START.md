# 🚀 Quick Start Guide - Video Conferencing App

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies

Open PowerShell in the project root directory and run:

```powershell
.\setup.ps1
```

OR manually:

```powershell
npm install
cd backend; npm install
cd ../frontend; npm install
cd ..
```

### Step 2: Start the Application

```powershell
npm run dev
```

That's it! The app will open automatically.

### Step 3: Test the App

1. **Open your browser** → http://localhost:5173
2. **Create an account** → Sign up with any email
3. **Create a meeting** → Click "New Meeting"
4. **Test in another window** → Open incognito/private window
5. **Join the meeting** → Use the room ID

## 🧪 Testing Checklist

### ✅ Authentication
- [ ] Sign up with new account
- [ ] Login with existing account
- [ ] Logout and login again

### ✅ Meeting Creation
- [ ] Create meeting without lobby
- [ ] Create meeting with lobby enabled
- [ ] View recent meetings list

### ✅ Joining Meeting
- [ ] Join via room ID
- [ ] Join from recent meetings
- [ ] Join with direct link

### ✅ Video & Audio
- [ ] Camera turns on automatically
- [ ] Microphone works
- [ ] Toggle camera on/off
- [ ] Toggle microphone on/off
- [ ] See other participants' video

### ✅ Screen Sharing
- [ ] Share screen
- [ ] Switch between windows
- [ ] Stop screen sharing

### ✅ Chat
- [ ] Send messages
- [ ] Receive messages
- [ ] View chat history

### ✅ Participants
- [ ] View participants list
- [ ] See online status
- [ ] See audio/video status

### ✅ Reactions & Interactions
- [ ] Raise hand
- [ ] Send reactions
- [ ] See others' reactions

### ✅ Host Controls (if you're host)
- [ ] Kick participant
- [ ] Mute all
- [ ] Approve lobby requests
- [ ] Start/stop recording

### ✅ Leaving Meeting
- [ ] Leave meeting
- [ ] End meeting (as host)
- [ ] Rejoin after leaving

## 🔧 Quick Troubleshooting

### Problem: "Cannot connect to server"
**Solution:** 
```powershell
# Make sure backend is running
cd backend
npm run dev
```

### Problem: "Camera not working"
**Solution:**
1. Allow camera permission in browser
2. Check if another app is using camera
3. Refresh the page

### Problem: "MongoDB connection error"
**Solution:**
The MongoDB connection string is already configured. Check your internet connection.

### Problem: "Port already in use"
**Solution:**
```powershell
# Kill process on port 5000 (backend)
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Kill process on port 5173 (frontend)
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
```

## 📱 Testing on Multiple Devices

### Same Computer (Recommended for testing)
1. **Window 1**: Normal browser → http://localhost:5173
2. **Window 2**: Incognito/Private → http://localhost:5173
3. Create/join the same room from both windows

### Different Computers (Same Network)
1. **Computer 1**: Run the app
2. **Computer 2**: Replace `localhost` with Computer 1's IP
   - Example: http://192.168.1.100:5173

### Mobile Testing
1. Find your computer's IP address:
   ```powershell
   ipconfig
   ```
2. On mobile browser, visit: http://YOUR_IP:5173

## 🎯 Common Test Scenarios

### Scenario 1: Two-Person Meeting
1. Open two browser windows
2. Login with different accounts in each
3. Create meeting in window 1
4. Join meeting in window 2 with room ID
5. Test video, audio, chat

### Scenario 2: Host Controls
1. Create meeting (you're the host)
2. Join from another window
3. Test kick participant
4. Test mute all
5. Enable lobby and test approval

### Scenario 3: Screen Share
1. Join a meeting
2. Click screen share button
3. Select window/screen to share
4. Verify others can see your screen
5. Stop sharing

### Scenario 4: Chat & Reactions
1. Join a meeting with multiple participants
2. Send chat messages
3. Send reactions
4. Raise hand
5. Verify all participants receive notifications

## 📊 Performance Tips

### For Best Performance:
- ✅ Use Chrome or Edge browser
- ✅ Close unnecessary tabs
- ✅ Use wired internet connection
- ✅ Limit to 4-6 participants for testing
- ✅ Use headphones to avoid echo

### Check Performance:
```powershell
# Monitor backend
cd backend
npm run dev

# Watch console for errors
# Check CPU usage in Task Manager
```

## 🎨 UI Testing Points

### Desktop (1920x1080)
- [ ] Video grid displays correctly
- [ ] Chat sidebar works
- [ ] Participants sidebar works
- [ ] All buttons are clickable

### Tablet (768px)
- [ ] Layout adjusts properly
- [ ] Controls remain accessible
- [ ] Video grid adapts

### Mobile (375px)
- [ ] Touch controls work
- [ ] Video fits screen
- [ ] Chat is accessible

## 📝 Known Limitations

1. **Browser Support**: Best on Chrome/Edge
2. **Mobile**: Limited to 2-3 participants for smooth performance
3. **Recording**: UI toggle only (actual recording requires server implementation)
4. **TURN Server**: Uses public STUN servers (may not work behind strict firewalls)

## 🆘 Need Help?

### Check Logs:
- **Backend**: Check terminal running backend
- **Frontend**: Open browser DevTools → Console
- **Network**: DevTools → Network tab

### Resources:
- [Setup Guide](SETUP_GUIDE.md) - Detailed setup
- [User Guide](USER_GUIDE.md) - Feature documentation
- [README](README.md) - Overview

## ✅ Success Criteria

Your installation is successful if you can:
- ✅ Create an account
- ✅ Create a meeting
- ✅ See your own video
- ✅ Join from another window
- ✅ See both videos in meeting
- ✅ Send and receive chat messages
- ✅ Toggle audio/video
- ✅ Share screen

## 🎉 Congratulations!

If you've completed the checklist, your video conferencing app is fully functional!

**Next Steps:**
- Customize the UI
- Add more features
- Deploy to production
- Share with friends

---

**Happy Testing! 🚀**
