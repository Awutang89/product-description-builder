# Page Crafter - Setup & Getting Started

## ✅ Phase 0 Complete!

Congratulations! The initial project structure has been set up. Here's what's been configured:

### Frontend Setup ✅
- **Framework**: React 18 with Vite
- **Port**: http://localhost:3000
- **Styling**: TailwindCSS
- **Key Libraries**:
  - react-router-dom (routing)
  - axios (HTTP client)
  - zustand (state management)
  - @dnd-kit (drag and drop)
  - lucide-react (icons)

### Backend Setup ✅
- **Framework**: Express.js
- **Port**: http://localhost:5000
- **Database**: MongoDB
- **Key Libraries**:
  - mongoose (MongoDB ORM)
  - cors (cross-origin)
  - helmet (security)
  - morgan (logging)
  - openai (AI integration)

---

## 🚀 Running the Project

### Step 1: Install MongoDB

**Option A: Local MongoDB**
```bash
# Windows (if you have Chocolatey)
choco install mongodb-community

# macOS
brew tap mongodb/brew
brew install mongodb-community

# Linux (Ubuntu)
sudo apt-get install -y mongodb
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Add it to `backend/.env` as `MONGODB_URI`

### Step 2: Start Backend Server

```bash
cd backend

# Configure environment variables if needed
# Edit .env and add your OpenAI API key and MongoDB URI

# Start the server
npm run dev

# Expected output:
# ✅ MongoDB Connected: localhost
# 🚀 Server running on http://localhost:5000
```

### Step 3: Start Frontend Development Server

**In a new terminal**:
```bash
cd frontend

# Start Vite dev server
npm run dev

# Expected output:
# VITE v5.0.0  ready in 123 ms
#
# ➜  Local:   http://localhost:3000/
# ➜  Press h to show help
```

### Step 4: Verify Connection

1. Open http://localhost:3000 in your browser
2. You should see the Page Crafter landing page
3. If backend is running, you'll see: ✅ Backend connected!
4. If you see ❌, make sure backend is running on port 5000

---

## 📁 Project Structure

```
product-description-builder/
├── frontend/                  # React + Vite application
│   ├── src/
│   │   ├── App.jsx           # Main component (landing page)
│   │   ├── main.jsx          # Entry point
│   │   ├── index.css         # Global styles + Tailwind
│   │   ├── services/
│   │   │   └── api.js        # API service with axios
│   │   ├── components/       # UI components (to build)
│   │   ├── pages/            # Page components (to build)
│   │   ├── hooks/            # Custom hooks (to build)
│   │   └── store/            # Zustand stores (to build)
│   ├── vite.config.js        # Vite configuration with API proxy
│   ├── tailwind.config.js    # Tailwind CSS config
│   ├── package.json
│   └── index.html
│
├── backend/                   # Express.js API server
│   ├── src/
│   │   ├── server.js         # Express app setup
│   │   ├── config/
│   │   │   └── database.js   # MongoDB connection
│   │   ├── models/           # Mongoose models (to build)
│   │   ├── routes/           # Express routes (to build)
│   │   ├── controllers/      # Route controllers (to build)
│   │   └── services/         # Business logic (to build)
│   ├── .env                  # Environment variables
│   ├── package.json
│   └── uploads/              # File uploads directory
│
├── docs/                      # Complete documentation
│   ├── README.md
│   ├── requirements/
│   ├── design/
│   ├── api/
│   ├── user-stories/
│   ├── roadmap/
│   ├── testing/
│   └── examples/
│
└── .gitignore
```

---

## 🛠️ Common Commands

### Frontend Commands
```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

### Backend Commands
```bash
cd backend

# Start with hot-reload
npm run dev

# Start production
npm start

# Run tests (when added)
npm test
```

---

## 🔌 API Proxy Configuration

The frontend is configured to proxy API calls to the backend:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Proxy: `/api` → `http://localhost:5000/api`

This means you can make requests like:
```javascript
axios.get('/api/projects')  // Proxied to http://localhost:5000/api/projects
```

---

## 🌱 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/page-crafter
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=your_key_here
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

### Frontend (.env.local) - Optional
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🧪 Testing the Setup

### Test Backend Connection
```bash
curl http://localhost:5000/health

# Expected response:
# {"status":"ok","timestamp":"2025-10-25T..."}
```

### Test Frontend API Integration
Visit http://localhost:3000 and click "Check Connection" button. You should see the backend status if everything is working.

---

## 📝 Next Steps (Phase 1)

Once both servers are running:

1. **Build Database Models**
   - Create Project model (in `backend/src/models/Project.js`)
   - Create Template model (in `backend/src/models/Template.js`)
   - Set up indexes and validations

2. **Build API Endpoints**
   - Project CRUD endpoints
   - Template endpoints
   - File upload endpoint
   - Test with Postman

3. **Create Frontend Services**
   - Project service (CRUD operations)
   - Template service
   - API integration

Reference: `docs/roadmap/DevelopmentRoadmap.md` for detailed Phase 1 tasks.

---

## 🐛 Troubleshooting

### Frontend doesn't connect to backend
- ✅ Check backend is running: `curl http://localhost:5000/health`
- ✅ Check frontend is running on port 3000
- ✅ Check browser console for CORS errors
- ✅ Verify API proxy in `frontend/vite.config.js`

### MongoDB connection error
- ✅ Check MongoDB is running: `mongosh --eval "db.adminCommand('ping')"`
- ✅ Verify MongoDB URI in `backend/.env`
- ✅ If using Atlas, whitelist your IP in Atlas dashboard

### Port already in use
```bash
# Find process using port 3000 (frontend)
lsof -i :3000

# Find process using port 5000 (backend)
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Dependencies issues
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Documentation

- **Product Requirements**: `docs/requirements/PRD.md`
- **Technical Design**: `docs/design/TechnicalDesign.md`
- **API Documentation**: `docs/api/APIDocumentation.md`
- **User Stories**: `docs/user-stories/UserStories.md`
- **Development Roadmap**: `docs/roadmap/DevelopmentRoadmap.md`
- **Testing Strategy**: `docs/testing/TestingStrategy.md`
- **Section Specs**: `docs/examples/SectionSpecifications.md`
- **HTML Examples**: `docs/examples/HTMLExportExamples.md`

---

## 🎯 Summary

You now have:
- ✅ A working React frontend with TailwindCSS
- ✅ A working Express backend with MongoDB connection
- ✅ API proxy configured for development
- ✅ Comprehensive documentation
- ✅ Ready to build Phase 1 (Database models & API endpoints)

**Happy building! 🚀**
