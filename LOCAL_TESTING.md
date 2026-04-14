# 🧪 Local Testing Guide

## ✅ Current Status

Both servers are now running successfully:

### Backend (Django)
- **Status**: ✅ Running
- **URL**: http://localhost:8000
- **API**: http://localhost:8000/api
- **Admin**: http://localhost:8000/admin
- **Server**: Python 3.13 + Django 5.2.13

### Frontend (React + Vite)
- **Status**: ✅ Running  
- **URL**: http://localhost:5173
- **Build Time**: 662ms
- **Package**: React 19.2 + Vite 8.0

---

## 📝 Test Credentials

For testing the admin panel:
- **Username**: `admin`
- **Email**: `admin@test.com`
- **Password**: `admin123`

---

## 🌐 Access Points

### 1. Frontend Application
Open in browser: **http://localhost:5173**

You should see:
- Login/Register page
- Music player interface
- Playlist management
- Track addition

### 2. Backend Admin Panel
Open in browser: **http://localhost:8000/admin**

Login with credentials above. You can:
- View all users
- View playlists
- View tracks
- Manage database directly

### 3. API Documentation
Available at: **http://localhost:8000/api**

### 4. API Endpoints

#### Authentication
```
POST   /api/auth/register/        Register new user
POST   /api/auth/login/           Login user
POST   /api/auth/refresh/         Refresh access token
POST   /api/auth/logout/          Logout user
GET    /api/auth/me/              Get current user info
```

#### Playlists
```
GET    /api/playlists/            List user's playlists
POST   /api/playlists/            Create new playlist
GET    /api/playlists/{id}/       Get playlist details
DELETE /api/playlists/{id}/       Delete playlist
```

#### Tracks
```
POST   /api/playlists/{id}/add-track/           Add track to playlist
DELETE /api/playlists/{id}/remove-track/{t_id}/ Remove track
PATCH  /api/playlists/{id}/reorder-tracks/     Reorder tracks
```

---

## 🧪 Testing Workflow

### Step 1: Register & Login (Frontend)
1. Go to http://localhost:5173
2. Click **Register** or **Sign Up**
3. Fill in:
   - Email: `testuser@example.com`
   - Password: `testpass123`
4. Submit
5. You should see playlists panel

### Step 2: Create a Playlist
1. In the playlists panel, click **Create Playlist** or "+"
2. Enter playlist name: `My First Playlist`
3. Submit
4. Playlist should appear in sidebar

### Step 3: Add Tracks
1. Click on your playlist
2. Look for input field "Add track from YouTube URL"
3. Paste a YouTube URL, for example:
   ```
   https://www.youtube.com/watch?v=dQw4w9WgXcQ
   ```
4. Press Enter or click Add
5. Track should appear in playlist

### Step 4: Manage Playlist
- **Drag & Drop**: Reorder tracks
- **Delete Track**: Click delete icon next to track
- **Delete Playlist**: Right-click or delete button

### Step 5: Test Auth
1. Refresh page (tokens should still work)
2. Click **Logout**
3. You should return to login page
4. Login with same credentials
5. Confirm your playlists are still there

---

## 🔍 Testing Checklist

### Frontend Tests
- [ ] Page loads at http://localhost:5173
- [ ] Register form appears
- [ ] Can create new user account
- [ ] Login works with credentials
- [ ] Playlists panel loads
- [ ] Can create playlist
- [ ] Can add track from YouTube URL
- [ ] Can delete tracks
- [ ] Can delete playlist
- [ ] Can logout
- [ ] Login works after logout
- [ ] Playlists persist after login
- [ ] Audio player loads
- [ ] Drag & drop reordering works

### Backend Tests
- [ ] Admin panel loads at http://localhost:8000/admin
- [ ] Can login as admin
- [ ] Users table shows registered users
- [ ] Playlists table shows created playlists
- [ ] Tracks table shows added tracks
- [ ] Database queries are fast

### API Tests (via Frontend/Browser Dev Tools)
- [ ] Registration returns user data
- [ ] Login returns access + refresh tokens
- [ ] Playlist operations work
- [ ] Track operations work
- [ ] Errors handled gracefully

### Error Handling Tests
- [ ] Try invalid YouTube URL (should show error)
- [ ] Try duplicate registration (should show error)
- [ ] Try empty playlist name (should show error)
- [ ] Token refresh works when access expires
- [ ] 401 errors trigger logout

---

## 🛠️ Troubleshooting Local Testing

### Frontend Won't Load
```bash
# Check if server is running
curl http://localhost:5173

# Restart frontend
# Press Ctrl+C in terminal
npm run dev
```

### Backend Won't Start
```bash
# Check dependencies
python -m pip list | findstr django

# Reinstall requirements
python -m pip install -r requirements.txt --force-reinstall

# Clear migrations (if needed)
rm db.sqlite3
python manage.py migrate
```

### CORS/API Errors in Frontend
1. Check browser console (F12 → Console tab)
2. Verify backend is running on port 8000
3. Check `CORS_ALLOWED_ORIGINS` in `backend/.env`
4. Should include: `http://localhost:5173`

### Database Issues
```bash
# Reset database (WARNING: deletes all data)
rm backend/db.sqlite3
python manage.py migrate

# Create fresh admin user
python manage.py createsuperuser
```

---

## 📊 Performance Monitoring

### Check Network Requests
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Reload page
4. Watch requests to `http://localhost:8000/api/*`
5. Response times should be < 200ms

### Check Frontend Performance
1. Open browser DevTools (F12)
2. Go to **Performance** tab
3. Record page interaction
4. Check loading metrics:
   - Page load: < 2 seconds
   - JavaScript parsing: < 500ms
   - React hydration: < 500ms

### Check Backend Performance
1. Terminal running backend shows request times
2. Watch for slow queries (> 100ms)
3. Example output:
   ```
   [14/Apr/2026 15:33:10] "POST /api/auth/login/ HTTP/1.1" 200 487  # 487ms
   ```

---

## 🔐 Testing Security (Optional)

### CORS Protection
```bash
# Test CORS header
curl -H "Origin: http://malicious.com" http://localhost:8000/api/auth/

# Should NOT include:
# Access-Control-Allow-Origin: http://malicious.com
```

### CSRF Protection
Frontend handles this automatically via the axios client.

### Token Expiry
1. Login
2. Wait 15 minutes
3. Try to add track
4. Should see "Please login" message
5. Login again
6. Should work

---

## 📝 Taking Notes on Issues

If you encounter any issues, note:
1. **What you were doing**
2. **What happened**
3. **Error message** (from console or terminal)
4. **Screenshot** (if helpful)

Example: "Tried to add YouTube URL, got 'Invalid URL' error even though URL was correct"

---

## 🎯 Full Test Scenario (5 minutes)

Complete this flow to verify everything:

```
1. Open http://localhost:5173
   ↓
2. Register: email@test.com / password
   ↓
3. Create playlist: "Test Playlist"
   ↓
4. Add track: https://www.youtube.com/watch?v=dQw4w9WgXcQ
   ↓
5. Verify track appears in list
   ↓
6. Drag track to reorder (if 2+ tracks)
   ↓
7. Delete playlist
   ↓
8. Logout
   ↓
9. Login with same credentials
   ↓
10. Verify new playlist is gone
    ↓
✅ ALL TESTS PASS!
```

---

## 🚀 When Ready to Stop Testing

### Stop Backend
```bash
# Press Ctrl+C in the backend terminal
# Or kill the process:
taskkill /PID {process_id} /F
```

### Stop Frontend
```bash
# Press Ctrl+C in the frontend terminal
```

### Clean Up
```bash
# Optional: Delete test database
rm backend/db.sqlite3

# Optional: Back up database
copy backend/db.sqlite3 backend/db.sqlite3.backup
```

---

## 📞 Need Help?

### Common Issues Resolution

**"Can't connect to http://localhost:8000"**
- Backend might not be running
- Run: `python e:\Sukh_Sangeet\backend\manage.py runserver 8000`

**"CORS error in console"**
- Check `backend/.env` has:
  ```
  CORS_ALLOWED_ORIGINS=http://localhost:5173
  ```

**"YouTube URL gives 'Video not found'"**
- URL might be private or invalid
- Try: https://www.youtube.com/watch?v=dQw4w9WgXcQ (Rick Astley - always works!)

**"Register button doesn't work"**
- Check browser console for errors (F12 → Console)
- Verify backend is running
- Try different email address

**"Playlist/tracks don't save"**
- Check database exists: `backend/db.sqlite3`
- If missing, run: `python manage.py migrate`

---

## ✨ Success Indicators

When everything works correctly, you should see:

🟢 **Frontend**
- Pages load instantly
- No console errors (except maybe warnings)
- All buttons responsive
- Audio player visible

🟢 **Backend**
- No errors in terminal
- Response times < 200ms
- Database queries working
- Admin panel accessible

🟢 **Integration**
- Can register User
- Can create Playlist
- Can add Track
- Can delete Track
- Can logout & login
- Data persists

**If all green: ✅ YOU'RE READY FOR PRODUCTION!**

---

**Last Updated**: April 14, 2026  
**Status**: ✅ Ready for Testing
