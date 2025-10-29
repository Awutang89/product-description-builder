# 🚀 Quick Start Guide

Get Page Crafter up and running in 5 minutes!

---

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB running locally OR MongoDB Atlas account
- Terminal/Command line access
- Code editor (VSCode recommended)

---

## ⚡ 5-Minute Setup

### Step 1: Install Backend (2 min)
```bash
cd backend
npm install
```

### Step 2: Configure Backend
Create `backend/.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/page-crafter
FRONTEND_URL=http://localhost:3000
```

### Step 3: Install Frontend (2 min)
```bash
cd frontend
npm install
```

### Step 4: Start Backend
```bash
cd backend
npm run dev
```

Expected output:
```
✅ MongoDB Connected: localhost
🚀 Server running on http://localhost:5000
```

### Step 5: Start Frontend (in new terminal)
```bash
cd frontend
npm run dev
```

Then open: **http://localhost:3000**

---

## ✅ Verify Installation

### Backend Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"ok","timestamp":"2025-10-25T..."}
```

### Frontend Test
- Dashboard should load with no projects
- Click "New Project" button
- Form should appear

---

## 🎯 First Project

1. **Create Project**
   - Click "New Project"
   - Name: "My First Product"
   - Add brand color: `#3B82F6`
   - Click "Create Project"

2. **Edit Project**
   - Click pencil icon
   - Drag sections from left panel
   - Click to select sections
   - Edit in right panel
   - Auto-saves every 2 seconds

3. **Manage Project**
   - Click "Back" to return to dashboard
   - Test: duplicate, search, filter

---

## 📚 Documentation

- **README.md** - Full project overview
- **API_TESTING.md** - API endpoints with cURL examples
- **PHASE_2_COMPLETE.md** - What's been built
- **docs/** - Detailed documentation

---

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
mongosh

# Check port 5000 is available
lsof -i :5000
```

### Frontend won't connect
```bash
# Clear browser cache (Ctrl+Shift+Del)
# Check backend is running on :5000
# Check console for errors (F12)
```

### Database issues
```bash
# Use MongoDB Atlas instead
# Update MONGODB_URI in .env:
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/page-crafter
```

---

## 🎓 Next Steps

1. **Explore the Application**
   - Create a few test projects
   - Try different section types
   - Test search and filtering
   - Experiment with editing

2. **Review Code**
   - Start with `frontend/src/App.jsx`
   - Check `frontend/src/pages/Dashboard.jsx`
   - Review `backend/src/models/Project.js`

3. **Read Documentation**
   - See README.md for full architecture
   - Check PHASE_2_COMPLETE.md for features
   - Review API_TESTING.md for endpoints

---

## 📦 Project Structure

```
product-description-builder/
├── backend/          (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── models/   (Database schemas)
│   │   ├── controllers/ (Business logic)
│   │   ├── routes/   (API endpoints)
│   │   └── server.js (Entry point)
│   └── package.json
│
├── frontend/         (React + Vite + TailwindCSS)
│   ├── src/
│   │   ├── pages/    (Dashboard, Editor, Templates)
│   │   ├── components/ (UI components)
│   │   ├── store/    (Zustand state)
│   │   ├── services/ (API calls)
│   │   └── App.jsx   (Root component)
│   └── package.json
│
└── docs/            (Comprehensive documentation)
```

---

## 🌐 URLs

Once running:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

---

## 💡 Tips

- Auto-save happens every 2 seconds when editing
- Click section headers to move them
- Duplicate sections to speed up editing
- Use templates for common layouts
- Search filters work in real-time

---

## 🔧 Development Tools

- **React DevTools**: Chrome extension for React debugging
- **MongoDB Compass**: Visual database explorer
- **Postman**: API testing tool
- **VSCode**: Code editor with extensions

---

**Setup Complete!** 🎉

You now have:
- ✅ Backend API running
- ✅ Frontend application running
- ✅ MongoDB connected
- ✅ Ready to create projects

Start creating! 🚀

---

For detailed information, see:
- [README.md](./README.md) - Full documentation
- [PHASE_2_COMPLETE.md](./PHASE_2_COMPLETE.md) - Feature list
- [API_TESTING.md](./API_TESTING.md) - API examples
