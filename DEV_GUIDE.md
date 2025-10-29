# Development Guide

## Quick Start - One Command Development

Instead of manually starting backend and frontend in separate terminals, use the automated scripts:

### Option 1: Using Batch Script (Recommended for Windows)

```bash
dev.bat
```

### Option 2: Using PowerShell Script

```powershell
.\dev.ps1
```

**What these scripts do:**
1. Kill any processes running on ports 3000 and 5000
2. Start backend server on port 5000
3. Wait 3 seconds for backend to initialize
4. Start frontend server on port 3000
5. Open two terminal windows (one for each server)

**No more port conflicts!**

---

## Environment Configuration

### Backend Configuration

File: `backend/.env`

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/page-crafter
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=your_key_here
```

### Frontend Configuration

File: `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_PORT=3000
```

**Important:** If you need to change ports, only update these `.env` files. The code will automatically use the new values.

---

## Manual Development (Old Way)

If you prefer to start servers manually:

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

---

## Port Configuration

### How It Works Now

1. **Backend Port**: Set in `backend/.env` (PORT variable)
2. **Frontend Port**: Set in `frontend/.env` (VITE_PORT variable)
3. **API URL**: Set in `frontend/.env` (VITE_API_URL variable)

### If Port 3000 is Taken

The frontend will now automatically try the next available port (3001, 3002, etc.) instead of failing.

You'll see a message like:
```
Port 3000 is in use, trying another one...
VITE ready at http://localhost:3001
```

---

## Changing Ports

### To Change Backend Port

1. Update `backend/.env`:
   ```env
   PORT=5001
   ```

2. Update `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

3. Restart servers using `dev.bat` or `dev.ps1`

### To Change Frontend Port

1. Update `frontend/.env`:
   ```env
   VITE_PORT=3001
   ```

2. Restart servers using `dev.bat` or `dev.ps1`

---

## Troubleshooting

### "Port already in use" Error

**Solution:** Use the `dev.bat` or `dev.ps1` script - they automatically kill old processes.

Or manually kill processes:

**Windows (PowerShell):**
```powershell
# Kill process on port 5000
Get-NetTCPConnection -LocalPort 5000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }

# Kill process on port 3000
Get-NetTCPConnection -LocalPort 3000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

**Windows (CMD):**
```cmd
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /F /PID <PID_NUMBER>
```

### Backend Can't Connect to MongoDB

1. Make sure MongoDB is running:
   ```bash
   mongod
   ```

2. Or use MongoDB Atlas (cloud):
   - Update `MONGODB_URI` in `backend/.env`
   - Use your Atlas connection string

### Frontend Can't Connect to Backend

1. Check if backend is running on correct port
2. Verify `VITE_API_URL` in `frontend/.env` matches backend port
3. Clear browser cache and reload

---

## Development Workflow

### Starting Your Work Session

1. Run `dev.bat` or `dev.ps1`
2. Wait for both servers to start
3. Open http://localhost:3000
4. Start coding!

### Stopping Servers

Press `Ctrl+C` in each terminal window, or just close the windows.

### Making Changes

- **Backend changes**: Server auto-restarts (using `--watch` flag)
- **Frontend changes**: Vite hot-reloads automatically
- **No need to restart manually!**

---

## Environment Variables Reference

### Backend Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| NODE_ENV | Environment mode | development | No |
| PORT | Backend server port | 5000 | No |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/page-crafter | Yes |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 | Yes |
| OPENAI_API_KEY | OpenAI API key | - | No* |

*Required for AI features (Phase 3)

### Frontend Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| VITE_API_URL | Backend API base URL | http://localhost:5000/api | Yes |
| VITE_PORT | Frontend dev server port | 3000 | No |

---

## Tips for Claude AI Development

When working with Claude Code:

1. **Use the dev scripts**: They ensure ports are always clean
2. **Only change .env files**: Don't edit port numbers in code
3. **One source of truth**: All URLs come from environment variables
4. **No more token waste**: Ports won't change unexpectedly

---

## Next Steps: Cloud Deployment

For persistent URLs that never change (useful for testing with AI):

### Recommended: Railway

- Free tier with $5/month credit
- Persistent URLs
- Easy deployment
- Perfect for testing

See `RAILWAY_GUIDE.md` (coming soon) for setup instructions.

### Alternative: Render

- Similar to Railway
- Good free tier
- Slightly slower cold starts

---

## Questions?

Check the main [README.md](./README.md) for full documentation.
