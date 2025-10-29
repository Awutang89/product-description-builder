# 📝 Page Crafter - Product Description Builder

A modern, drag-and-drop product description builder for Shopify with AI-powered content generation. Create beautiful, responsive product pages without code.

![Status](https://img.shields.io/badge/Status-Phase%202%20Complete-success)
![React](https://img.shields.io/badge/React-18.1.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen)

---

## 🎯 Features

### 📊 Dashboard
- Create, edit, duplicate, and delete projects
- Search and filter projects
- Draft/published status
- Pagination (20 projects per page)
- Responsive grid layout

### ✏️ Editor
- **3-column layout**: Section Library | Canvas | Settings
- **8 section types**: Hero, Text, Image, Gallery, Features, CTA, Testimonial, Comparison
- Drag-and-drop ready (foundation implemented)
- Real-time preview
- Auto-save (2-second debounce)
- Section duplication
- Content and style editing

### ✨ Templates
- Browse pre-built templates
- Filter by category: tech, fashion, home, beauty, sports, general
- Search functionality
- Featured templates
- Usage tracking

### 🤖 AI Integration (Phase 3)
- OpenAI integration for content generation
- Section-specific AI prompts
- Auto-generate product descriptions
- Smart title/subtitle suggestions

### 📤 Export (Phase 4)
- Export to HTML/CSS
- Shopify product description format
- Responsive markup
- Inline styling

---

## 🏗️ Architecture

### Tech Stack

**Frontend**
- React 18.1.1
- React Router DOM 7.9.4
- Zustand (State Management)
- TailwindCSS 4.1.16
- Axios
- Lucide React (Icons)
- Vite (Build Tool)

**Backend**
- Node.js / Express.js
- MongoDB / Mongoose
- Joi (Validation)
- Helmet (Security)
- Morgan (Logging)
- CORS enabled

**Future**
- OpenAI API (Phase 3)
- HTML Generation Engine (Phase 4)

### Folder Structure

```
product-description-builder/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── models/
│   │   │   ├── Project.js
│   │   │   └── Template.js
│   │   ├── controllers/
│   │   │   ├── projectController.js
│   │   │   └── templateController.js
│   │   ├── routes/
│   │   │   ├── projectRoutes.js
│   │   │   ├── templateRoutes.js
│   │   │   └── index.js
│   │   └── server.js
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── store/
│   │   │   ├── projectStore.js
│   │   │   └── editorStore.js
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Templates.jsx
│   │   │   └── Editor.jsx
│   │   ├── components/
│   │   │   ├── Navigation.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── CreateProjectModal.jsx
│   │   │   ├── SectionLibrary.jsx
│   │   │   ├── Canvas.jsx
│   │   │   └── SettingsPanel.jsx
│   │   ├── services/
│   │   │   ├── projectService.js
│   │   │   ├── templateService.js
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .gitignore
│   └── package.json
│
├── docs/
│   ├── requirements/
│   │   └── PRD.md
│   ├── design/
│   │   └── TechnicalDesign.md
│   ├── api/
│   │   └── APIDocumentation.md
│   ├── testing/
│   │   └── TestingStrategy.md
│   ├── examples/
│   │   ├── SectionSpecifications.md
│   │   └── HTMLExportExamples.md
│   └── ...
│
├── PHASE_1_COMPLETE.md
├── PHASE_2_COMPLETE.md
├── PHASE_2_PROGRESS.md
├── API_TESTING.md
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

#### 1. Clone Repository
```bash
git clone <repository-url>
cd product-description-builder
```

#### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/page-crafter
FRONTEND_URL=http://localhost:3000
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
```

### Running the Application

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

Expected output:
```
✅ MongoDB Connected: localhost
🚀 Server running on http://localhost:5000
📊 Health check: http://localhost:5000/health
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Then open http://localhost:3000 in your browser

---

## 📚 API Documentation

### Health Check
```bash
GET /health
```

### Projects Endpoints
```
POST   /api/projects                 - Create project
GET    /api/projects                 - List projects
GET    /api/projects/:id             - Get single project
PUT    /api/projects/:id             - Update project
DELETE /api/projects/:id             - Delete project
POST   /api/projects/:id/duplicate   - Duplicate project
```

### Templates Endpoints
```
POST   /api/templates                  - Create template
GET    /api/templates                  - List templates
GET    /api/templates/featured         - Get featured
GET    /api/templates/category/:cat    - Get by category
GET    /api/templates/:id              - Get single
PUT    /api/templates/:id              - Update template
DELETE /api/templates/:id              - Delete template
POST   /api/templates/:id/use          - Record usage
```

See [API_TESTING.md](./API_TESTING.md) for detailed examples with cURL.

---

## 🧪 Testing

### Backend API Testing
```bash
# Create project
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","brandColors":["#3B82F6"]}'

# List projects
curl http://localhost:5000/api/projects

# Get single project
curl http://localhost:5000/api/projects/{id}
```

See [API_TESTING.md](./API_TESTING.md) for complete testing guide.

### Frontend Testing

#### Dashboard
1. Open http://localhost:3000
2. Create new project
3. Search and filter projects
4. Edit, duplicate, or delete projects

#### Editor
1. Click edit on any project
2. Drag sections from left panel
3. Click to select sections
4. Edit properties on right panel
5. Auto-saves after 2 seconds

#### Templates
1. Click "✨ Templates"
2. Filter by category
3. Search templates
4. Click "Use Template"

---

## 📖 Documentation

- [PRD](./docs/requirements/PRD.md) - Complete product requirements
- [Technical Design](./docs/design/TechnicalDesign.md) - Architecture and design patterns
- [API Documentation](./docs/api/APIDocumentation.md) - API specs and examples
- [User Stories](./docs/user-stories/UserStories.md) - 35+ user stories with acceptance criteria
- [Testing Strategy](./docs/testing/TestingStrategy.md) - Comprehensive testing approach
- [Section Specifications](./docs/examples/SectionSpecifications.md) - Detailed section specifications
- [HTML Export Examples](./docs/examples/HTMLExportExamples.md) - Export format examples
- [Phase 1 Complete](./PHASE_1_COMPLETE.md) - Backend foundation
- [Phase 2 Complete](./PHASE_2_COMPLETE.md) - Frontend editor
- [API Testing Guide](./API_TESTING.md) - cURL examples and testing workflow

---

## 🎯 Development Phases

### ✅ Phase 0: Setup
- Project initialization
- Frontend (React + Vite)
- Backend (Node + Express)
- MongoDB connection
- Development environment

### ✅ Phase 1: Backend Foundation
- Project model with validation
- Template model with features
- 14 API endpoints (6 project + 8 template)
- Full CRUD controllers
- Error handling
- Database indexes

### ✅ Phase 2: Frontend Editor
- Dashboard with project management
- Editor with 3-column layout
- 8 section types
- Real-time editing
- Auto-save functionality
- Template browsing
- Navigation and routing

### 🔄 Phase 3: AI Integration (In Progress)
- OpenAI API integration
- Section-specific content generation
- AI prompt UI
- Generated content preview
- Approve/reject workflow

### 📋 Phase 4: Export & Shopify
- HTML generation engine
- Shopify format support
- Responsive markup
- CSS generation
- Preview before export
- Multiple export formats

---

## 🔄 Data Models

### Project Schema
```javascript
{
  name: String (required, 1-100 chars),
  description: String (optional, max 500 chars),
  sections: [Section],
  brandColors: [String (hex)],
  isDraft: Boolean (default: true),
  metadata: {
    sectionCount: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Section Schema
```javascript
{
  id: String (UUID),
  type: String (hero, text, image, gallery, etc.),
  order: Number,
  config: Mixed,
  content: {
    title?: String,
    text?: String,
    imageUrl?: String,
    // ... section-specific fields
  },
  styles: {
    bgColor?: String,
    textColor?: String,
    fontSize?: String,
    padding?: String,
    marginBottom?: String,
    // ... more styles
  }
}
```

### Template Schema
```javascript
{
  name: String (required),
  description: String (required),
  category: String (enum),
  sections: [Mixed],
  isPrebuilt: Boolean,
  isFeatured: Boolean,
  usageCount: Number,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Security

- Helmet.js for security headers
- CORS enabled for frontend origin
- Input validation with Joi
- MongoDB injection prevention
- XSS protection via React
- HTTPS ready (production)

---

## 📊 Performance

- Pagination (20 items per page)
- Database indexes on frequently queried fields
- Lean queries for list operations
- Auto-save debouncing (2 seconds)
- Lazy loading components
- Optimized grid layouts
- Efficient state management

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check MongoDB connection
mongosh
show dbs

# Check if port 5000 is in use
lsof -i :5000
```

### Frontend Won't Connect
```bash
# Clear browser cache
# Check API proxy in vite.config.js
# Verify backend is running on :5000
# Check browser console for CORS errors
```

### MongoDB Connection Issues
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas
# Update MONGODB_URI in .env
```

---

## 📝 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/page-crafter
FRONTEND_URL=http://localhost:3000
```

### Frontend (vite.config.js)
```javascript
server: {
  proxy: {
    '/api': 'http://localhost:5000'
  }
}
```

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com)
- [TailwindCSS](https://tailwindcss.com)
- [Zustand](https://github.com/pmndrs/zustand)

---

## 📧 Support

For issues, questions, or suggestions:
1. Check existing documentation
2. Review API_TESTING.md for endpoints
3. Check browser console for errors
4. Check backend logs for server errors

---

## 🎉 Next Steps

1. **Test the Application**
   - Follow Getting Started instructions
   - Create a test project
   - Test all features
   - Report any issues

2. **Phase 3 Development**
   - Implement OpenAI integration
   - Add AI content generation
   - Build AI UI components

3. **Phase 4 Development**
   - Build HTML generation engine
   - Implement Shopify export
   - Add export formats

---

## 📊 Statistics

| Metric | Count |
|--------|-------|
| Backend Files | 8 |
| Frontend Files | 20+ |
| Documentation Files | 8+ |
| API Endpoints | 14 |
| Database Models | 2 |
| React Components | 6 |
| Zustand Stores | 2 |
| Lines of Code | 3,000+ |
| Section Types | 8 |

---

**Last Updated**: October 25, 2025
**Current Phase**: 2 (Frontend Complete)
**Status**: Ready for Phase 3 (AI Integration)

---

Made with ❤️ for Shopify sellers

