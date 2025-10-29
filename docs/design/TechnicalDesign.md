# Page Crafter - Technical Design Document

## Document Information
- **Version**: 1.0
- **Last Updated**: 2025-10-25
- **Status**: Draft
- **Owner**: Engineering Team

---

## Table of Contents
1. [System Architecture](#1-system-architecture)
2. [Frontend Architecture](#2-frontend-architecture)
3. [Backend Architecture](#3-backend-architecture)
4. [Data Models](#4-data-models)
5. [API Design](#5-api-design)
6. [Component Specifications](#6-component-specifications)
7. [State Management](#7-state-management)
8. [HTML Export Engine](#8-html-export-engine)
9. [AI Integration](#9-ai-integration)
10. [Security Architecture](#10-security-architecture)
11. [Performance Optimization](#11-performance-optimization)
12. [Deployment Architecture](#12-deployment-architecture)

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Browser                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           React Frontend Application                   │  │
│  │  ┌────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │   Editor   │  │   Preview    │  │   Export     │  │  │
│  │  │  Component │  │   Engine     │  │   Generator  │  │  │
│  │  └────────────┘  └──────────────┘  └──────────────┘  │  │
│  │          │               │                  │          │  │
│  │          └───────────────┴──────────────────┘          │  │
│  │                          │                              │  │
│  │                  ┌───────▼────────┐                    │  │
│  │                  │  State Manager │                    │  │
│  │                  │   (Zustand)    │                    │  │
│  │                  └───────┬────────┘                    │  │
│  └──────────────────────────┼──────────────────────────────┘  │
└──────────────────────────────┼──────────────────────────────┘
                               │
                    HTTP/REST API (Axios)
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                   Express.js Backend Server                  │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Project   │  │   Template   │  │      AI      │       │
│  │  API       │  │   API        │  │   Service    │       │
│  └─────┬──────┘  └──────┬───────┘  └──────┬───────┘       │
│        │                 │                  │               │
│        └─────────────────┴──────────────────┘               │
│                          │                                   │
│                  ┌───────▼────────┐                         │
│                  │   MongoDB      │                         │
│                  │   Database     │                         │
│                  └────────────────┘                         │
└──────────────────────────────────────────────────────────────┘
                               │
                    External APIs
                               │
                  ┌────────────▼─────────────┐
                  │    OpenAI API (GPT-4)   │
                  └──────────────────────────┘
```

### 1.2 Technology Stack

#### Frontend
- **Framework**: React 18.2+
- **Build Tool**: Vite 5.0+
- **Language**: JavaScript (ES6+) / TypeScript (optional)
- **Styling**: TailwindCSS 3.4+
- **Drag & Drop**: @dnd-kit/core
- **Rich Text Editor**: TipTap 2.0+
- **HTTP Client**: Axios 1.6+
- **State Management**: Zustand 4.0+
- **Routing**: React Router 6.0+
- **Form Handling**: React Hook Form
- **Icons**: Lucide React / Heroicons

#### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18+
- **Database**: MongoDB 6.0+
- **ODM**: Mongoose 8.0+
- **AI Integration**: OpenAI Node SDK
- **Validation**: Joi / Zod
- **Authentication** (future): JWT, Passport.js
- **File Upload**: Multer
- **Environment**: dotenv

#### DevOps & Tools
- **Version Control**: Git
- **Package Manager**: npm / pnpm
- **Linting**: ESLint + Prettier
- **Testing**: Vitest, React Testing Library
- **API Testing**: Postman / Insomnia

---

## 2. Frontend Architecture

### 2.1 Project Structure

```
frontend/
├── public/
│   ├── favicon.ico
│   └── assets/
│       └── icons/
├── src/
│   ├── main.jsx                 # Entry point
│   ├── App.jsx                  # Root component
│   ├── components/              # Reusable components
│   │   ├── ui/                  # UI primitives
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── ColorPicker.jsx
│   │   ├── editor/              # Editor-specific components
│   │   │   ├── EditorCanvas.jsx
│   │   │   ├── SectionLibrary.jsx
│   │   │   ├── SettingsPanel.jsx
│   │   │   └── PreviewToggle.jsx
│   │   └── sections/            # Section components
│   │       ├── BasicSection/
│   │       │   ├── Heading.jsx
│   │       │   ├── Paragraph.jsx
│   │       │   ├── Media.jsx
│   │       │   ├── Button.jsx
│   │       │   ├── Spacer.jsx
│   │       │   └── Divider.jsx
│   │       ├── ProductSection/
│   │       │   ├── ProductHighlight.jsx
│   │       │   ├── ProsCons.jsx
│   │       │   ├── Specification.jsx
│   │       │   └── Features.jsx
│   │       ├── ColumnSection/
│   │       │   ├── TwoColumn.jsx
│   │       │   └── ThreeColumn.jsx
│   │       ├── MediaSection/
│   │       │   ├── Gallery.jsx
│   │       │   └── ImageGrid.jsx
│   │       └── AdvancedSection/
│   │           ├── Accordion.jsx
│   │           └── Rating.jsx
│   ├── pages/                   # Page components
│   │   ├── EditorPage.jsx
│   │   ├── ProjectsPage.jsx
│   │   ├── TemplatesPage.jsx
│   │   └── ExportPage.jsx
│   ├── hooks/                   # Custom hooks
│   │   ├── useEditor.js
│   │   ├── useAutoSave.js
│   │   ├── useUndo.js
│   │   └── useAI.js
│   ├── store/                   # State management
│   │   ├── editorStore.js
│   │   ├── projectStore.js
│   │   └── templateStore.js
│   ├── services/                # API services
│   │   ├── api.js
│   │   ├── projectService.js
│   │   ├── templateService.js
│   │   └── aiService.js
│   ├── utils/                   # Utility functions
│   │   ├── htmlGenerator.js
│   │   ├── cssGenerator.js
│   │   ├── validators.js
│   │   └── helpers.js
│   ├── constants/               # Constants
│   │   ├── sectionTypes.js
│   │   └── defaultStyles.js
│   └── styles/                  # Global styles
│       ├── index.css
│       └── tailwind.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env.example
```

### 2.2 Component Architecture

#### 2.2.1 Section Component Pattern

All section components follow a consistent structure:

```javascript
// src/components/sections/BasicSection/Heading.jsx
import { memo } from 'react';
import { useSectionConfig } from '@/hooks/useSectionConfig';

const Heading = memo(({ sectionId, config, isPreview }) => {
  const { updateConfig } = useSectionConfig(sectionId);

  const handleChange = (key, value) => {
    updateConfig({ [key]: value });
  };

  return (
    <div className="section-heading" data-section-id={sectionId}>
      {isPreview ? (
        <h2
          className={`text-${config.size} text-${config.align} font-${config.weight}`}
          style={{ color: config.color }}
        >
          {config.text}
        </h2>
      ) : (
        <input
          type="text"
          value={config.text}
          onChange={(e) => handleChange('text', e.target.value)}
          className="editable-heading"
        />
      )}
    </div>
  );
});

Heading.defaultConfig = {
  type: 'heading',
  text: 'Your Heading Here',
  size: '2xl',
  align: 'left',
  weight: 'bold',
  color: '#000000',
};

export default Heading;
```

#### 2.2.2 Editor Canvas

```javascript
// src/components/editor/EditorCanvas.jsx
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SectionRenderer from './SectionRenderer';

const EditorCanvas = ({ sections, isPreview }) => {
  const { setNodeRef } = useDroppable({ id: 'canvas' });

  return (
    <div
      ref={setNodeRef}
      className="editor-canvas min-h-screen bg-white p-8"
    >
      <SortableContext
        items={sections.map(s => s.id)}
        strategy={verticalListSortingStrategy}
      >
        {sections.map((section) => (
          <SectionRenderer
            key={section.id}
            section={section}
            isPreview={isPreview}
          />
        ))}
      </SortableContext>
    </div>
  );
};
```

### 2.3 Drag & Drop Implementation

Using @dnd-kit for drag and drop functionality:

```javascript
// src/hooks/useEditorDnD.js
import { useState } from 'react';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

export const useEditorDnD = (sections, setSections) => {
  const [activeId, setActiveId] = useState(null);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    // Adding new section from library
    if (active.data.current?.isNew) {
      const newSection = createSection(active.id);
      const overIndex = sections.findIndex(s => s.id === over.id);
      const insertIndex = overIndex >= 0 ? overIndex + 1 : sections.length;
      setSections([...sections.slice(0, insertIndex), newSection, ...sections.slice(insertIndex)]);
    }
    // Reordering existing sections
    else if (active.id !== over.id) {
      const oldIndex = sections.findIndex(s => s.id === active.id);
      const newIndex = sections.findIndex(s => s.id === over.id);
      setSections(arrayMove(sections, oldIndex, newIndex));
    }

    setActiveId(null);
  };

  return { handleDragStart, handleDragEnd, activeId };
};
```

---

## 3. Backend Architecture

### 3.1 Project Structure

```
backend/
├── src/
│   ├── server.js               # Entry point
│   ├── app.js                  # Express app setup
│   ├── config/                 # Configuration
│   │   ├── database.js
│   │   ├── openai.js
│   │   └── constants.js
│   ├── controllers/            # Route controllers
│   │   ├── projectController.js
│   │   ├── templateController.js
│   │   └── aiController.js
│   ├── models/                 # Mongoose models
│   │   ├── Project.js
│   │   ├── Template.js
│   │   └── User.js (future)
│   ├── routes/                 # Express routes
│   │   ├── index.js
│   │   ├── projectRoutes.js
│   │   ├── templateRoutes.js
│   │   └── aiRoutes.js
│   ├── services/               # Business logic
│   │   ├── aiService.js
│   │   ├── htmlService.js
│   │   └── validationService.js
│   ├── middleware/             # Express middleware
│   │   ├── errorHandler.js
│   │   ├── validation.js
│   │   ├── rateLimit.js
│   │   └── cors.js
│   └── utils/                  # Utility functions
│       ├── logger.js
│       └── helpers.js
├── uploads/                    # File uploads (temporary)
├── package.json
├── .env.example
└── .gitignore
```

### 3.2 Express Server Setup

```javascript
// src/server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDatabase } from './config/database.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
```

### 3.3 Database Connection

```javascript
// src/config/database.js
import mongoose from 'mongoose';

export const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};
```

---

## 4. Data Models

### 4.1 Project Model

```javascript
// src/models/Project.js
import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  order: { type: Number, required: true },
  config: { type: mongoose.Schema.Types.Mixed, default: {} },
  content: { type: mongoose.Schema.Types.Mixed, default: {} },
  styles: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { _id: false });

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  sections: [sectionSchema],
  brandColors: [{
    type: String,
    match: /^#[0-9A-Fa-f]{6}$/
  }],
  typography: {
    headingFont: String,
    bodyFont: String,
  },
  isDraft: {
    type: Boolean,
    default: true
  },
  lastExportedAt: Date,
  metadata: {
    sectionCount: Number,
    estimatedRenderTime: Number,
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
projectSchema.index({ createdAt: -1 });
projectSchema.index({ updatedAt: -1 });
projectSchema.index({ name: 'text' });

// Virtual for section count
projectSchema.virtual('totalSections').get(function() {
  return this.sections.length;
});

// Pre-save middleware
projectSchema.pre('save', function(next) {
  if (this.sections) {
    this.metadata.sectionCount = this.sections.length;
  }
  next();
});

export default mongoose.model('Project', projectSchema);
```

### 4.2 Template Model

```javascript
// src/models/Template.js
import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  thumbnail: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['tech', 'fashion', 'home', 'beauty', 'sports', 'general'],
    default: 'general'
  },
  sections: [{
    type: mongoose.Schema.Types.Mixed
  }],
  brandColors: [String],
  isPrebuilt: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  usageCount: {
    type: Number,
    default: 0
  },
  tags: [String],
}, {
  timestamps: true
});

// Indexes
templateSchema.index({ category: 1 });
templateSchema.index({ isPrebuilt: 1 });
templateSchema.index({ usageCount: -1 });
templateSchema.index({ name: 'text', description: 'text' });

// Increment usage count
templateSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  return this.save();
};

export default mongoose.model('Template', templateSchema);
```

---

## 5. API Design

### 5.1 API Endpoints

#### Project Endpoints

```
POST   /api/projects              # Create new project
GET    /api/projects              # Get all projects (paginated)
GET    /api/projects/:id          # Get project by ID
PUT    /api/projects/:id          # Update project
DELETE /api/projects/:id          # Delete project
POST   /api/projects/:id/duplicate # Duplicate project
POST   /api/projects/:id/export   # Export project to HTML
```

#### Template Endpoints

```
POST   /api/templates             # Create template from project
GET    /api/templates             # Get all templates (filtered, paginated)
GET    /api/templates/:id         # Get template by ID
PUT    /api/templates/:id         # Update template
DELETE /api/templates/:id         # Delete template
POST   /api/templates/:id/use     # Increment usage count
```

#### AI Endpoints

```
POST   /api/ai/generate-section   # Generate content for section
POST   /api/ai/generate-page      # Generate full page description
POST   /api/ai/refine             # Refine existing content
```

### 5.2 Request/Response Examples

#### Create Project

**Request**:
```http
POST /api/projects
Content-Type: application/json

{
  "name": "Premium Wireless Headphones",
  "description": "Product page for high-end headphones",
  "sections": [],
  "brandColors": ["#3B82F6", "#1E40AF", "#DBEAFE"]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "proj_abc123",
    "name": "Premium Wireless Headphones",
    "description": "Product page for high-end headphones",
    "sections": [],
    "brandColors": ["#3B82F6", "#1E40AF", "#DBEAFE"],
    "isDraft": true,
    "createdAt": "2025-10-25T12:00:00Z",
    "updatedAt": "2025-10-25T12:00:00Z"
  }
}
```

#### Generate AI Content

**Request**:
```http
POST /api/ai/generate-section
Content-Type: application/json

{
  "sectionType": "product-highlight",
  "productInfo": {
    "name": "ProMax Wireless Headphones",
    "features": ["Active Noise Cancellation", "40hr battery", "Premium comfort"],
    "targetAudience": "professionals and audiophiles"
  },
  "tone": "professional"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "content": {
      "headline": "ProMax Wireless Headphones: Your Sound Sanctuary",
      "description": "Experience audio perfection with industry-leading Active Noise Cancellation...",
      "cta": "Shop Now"
    },
    "tokensUsed": 245,
    "generatedAt": "2025-10-25T12:01:00Z"
  }
}
```

### 5.3 Error Responses

Standard error format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid project data",
    "details": [
      {
        "field": "name",
        "message": "Name is required"
      }
    ]
  }
}
```

Error codes:
- `VALIDATION_ERROR`: Invalid request data
- `NOT_FOUND`: Resource not found
- `UNAUTHORIZED`: Authentication required
- `RATE_LIMITED`: Too many requests
- `AI_SERVICE_ERROR`: OpenAI API error
- `DATABASE_ERROR`: Database operation failed
- `INTERNAL_ERROR`: Unexpected server error

---

## 6. Component Specifications

### 6.1 Section Configuration Schema

Each section type has a configuration schema:

```javascript
// src/constants/sectionSchemas.js

export const SECTION_SCHEMAS = {
  heading: {
    type: 'heading',
    category: 'basic',
    label: 'Heading',
    icon: 'Type',
    defaultConfig: {
      text: 'Your Heading Here',
      tag: 'h2', // h1, h2, h3, h4, h5, h6
      fontSize: '2xl', // sm, base, lg, xl, 2xl, 3xl, 4xl
      fontWeight: 'bold', // normal, medium, semibold, bold
      textAlign: 'left', // left, center, right
      color: '#000000',
      marginTop: '16',
      marginBottom: '8',
    },
    editableFields: [
      { key: 'text', type: 'text', label: 'Text' },
      { key: 'tag', type: 'select', label: 'Heading Level', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
      { key: 'fontSize', type: 'select', label: 'Font Size', options: ['sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'] },
      { key: 'fontWeight', type: 'select', label: 'Font Weight', options: ['normal', 'medium', 'semibold', 'bold'] },
      { key: 'textAlign', type: 'select', label: 'Alignment', options: ['left', 'center', 'right'] },
      { key: 'color', type: 'color', label: 'Text Color' },
    ]
  },

  'product-highlight': {
    type: 'product-highlight',
    category: 'product',
    label: 'Product Highlight',
    icon: 'Star',
    defaultConfig: {
      layout: 'image-left', // image-left, image-right
      image: {
        url: '',
        alt: '',
        width: '50%',
      },
      headline: 'Introducing Our Best Product',
      description: 'Lorem ipsum dolor sit amet...',
      features: [
        'Feature one',
        'Feature two',
        'Feature three'
      ],
      cta: {
        text: 'Shop Now',
        url: '#',
        style: 'primary'
      },
      backgroundColor: '#F9FAFB',
      padding: '32',
    },
    editableFields: [
      { key: 'layout', type: 'select', label: 'Layout', options: ['image-left', 'image-right'] },
      { key: 'image.url', type: 'image', label: 'Product Image' },
      { key: 'image.alt', type: 'text', label: 'Image Alt Text' },
      { key: 'headline', type: 'text', label: 'Headline' },
      { key: 'description', type: 'textarea', label: 'Description' },
      { key: 'features', type: 'list', label: 'Features' },
      { key: 'cta.text', type: 'text', label: 'Button Text' },
      { key: 'cta.url', type: 'text', label: 'Button URL' },
      { key: 'backgroundColor', type: 'color', label: 'Background Color' },
    ]
  },

  'pros-cons': {
    type: 'pros-cons',
    category: 'product',
    label: 'Pros & Cons',
    icon: 'ThumbsUp',
    defaultConfig: {
      title: 'Why Choose This Product?',
      pros: [
        'High quality materials',
        'Affordable price',
        'Great customer support'
      ],
      cons: [
        'Limited color options',
        'Not available worldwide'
      ],
      prosLabel: 'Pros',
      consLabel: 'Cons',
      prosColor: '#10B981',
      consColor: '#EF4444',
    },
    editableFields: [
      { key: 'title', type: 'text', label: 'Section Title' },
      { key: 'pros', type: 'list', label: 'Pros' },
      { key: 'cons', type: 'list', label: 'Cons' },
      { key: 'prosLabel', type: 'text', label: 'Pros Label' },
      { key: 'consLabel', type: 'text', label: 'Cons Label' },
    ]
  },

  // More section schemas...
};
```

### 6.2 Section Registry

```javascript
// src/constants/sectionRegistry.js
import Heading from '@/components/sections/BasicSection/Heading';
import Paragraph from '@/components/sections/BasicSection/Paragraph';
import ProductHighlight from '@/components/sections/ProductSection/ProductHighlight';
// ... other imports

export const SECTION_COMPONENTS = {
  heading: Heading,
  paragraph: Paragraph,
  'product-highlight': ProductHighlight,
  'pros-cons': ProsCons,
  // ... more mappings
};

export const getSectionComponent = (type) => {
  return SECTION_COMPONENTS[type] || null;
};
```

---

## 7. State Management

### 7.1 Zustand Store Architecture

```javascript
// src/store/editorStore.js
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';

export const useEditorStore = create(
  devtools(
    immer((set, get) => ({
      // State
      project: null,
      sections: [],
      selectedSectionId: null,
      history: [],
      historyIndex: -1,
      isDirty: false,
      isPreviewMode: false,
      previewDevice: 'desktop', // desktop, mobile
      brandColors: [],

      // Actions
      loadProject: (project) => set((state) => {
        state.project = project;
        state.sections = project.sections || [];
        state.brandColors = project.brandColors || [];
        state.history = [project.sections];
        state.historyIndex = 0;
        state.isDirty = false;
      }),

      addSection: (sectionType, index = null) => set((state) => {
        const newSection = {
          id: uuidv4(),
          type: sectionType,
          order: index ?? state.sections.length,
          config: SECTION_SCHEMAS[sectionType].defaultConfig,
          content: {},
          styles: {},
        };

        if (index !== null) {
          state.sections.splice(index, 0, newSection);
        } else {
          state.sections.push(newSection);
        }

        // Update order
        state.sections.forEach((section, idx) => {
          section.order = idx;
        });

        // Add to history
        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push([...state.sections]);
        state.historyIndex++;
        state.isDirty = true;
      }),

      updateSection: (sectionId, updates) => set((state) => {
        const section = state.sections.find(s => s.id === sectionId);
        if (section) {
          Object.assign(section, updates);
          state.isDirty = true;
        }
      }),

      updateSectionConfig: (sectionId, configUpdates) => set((state) => {
        const section = state.sections.find(s => s.id === sectionId);
        if (section) {
          section.config = { ...section.config, ...configUpdates };
          state.isDirty = true;
        }
      }),

      deleteSection: (sectionId) => set((state) => {
        state.sections = state.sections.filter(s => s.id !== sectionId);
        state.sections.forEach((section, idx) => {
          section.order = idx;
        });
        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push([...state.sections]);
        state.historyIndex++;
        state.isDirty = true;
      }),

      duplicateSection: (sectionId) => set((state) => {
        const sectionIndex = state.sections.findIndex(s => s.id === sectionId);
        if (sectionIndex !== -1) {
          const originalSection = state.sections[sectionIndex];
          const duplicatedSection = {
            ...originalSection,
            id: uuidv4(),
          };
          state.sections.splice(sectionIndex + 1, 0, duplicatedSection);
          state.sections.forEach((section, idx) => {
            section.order = idx;
          });
          state.isDirty = true;
        }
      }),

      reorderSections: (oldIndex, newIndex) => set((state) => {
        const [movedSection] = state.sections.splice(oldIndex, 1);
        state.sections.splice(newIndex, 0, movedSection);
        state.sections.forEach((section, idx) => {
          section.order = idx;
        });
        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push([...state.sections]);
        state.historyIndex++;
        state.isDirty = true;
      }),

      selectSection: (sectionId) => set({ selectedSectionId: sectionId }),

      undo: () => set((state) => {
        if (state.historyIndex > 0) {
          state.historyIndex--;
          state.sections = [...state.history[state.historyIndex]];
        }
      }),

      redo: () => set((state) => {
        if (state.historyIndex < state.history.length - 1) {
          state.historyIndex++;
          state.sections = [...state.history[state.historyIndex]];
        }
      }),

      togglePreview: () => set((state) => {
        state.isPreviewMode = !state.isPreviewMode;
      }),

      setPreviewDevice: (device) => set({ previewDevice: device }),

      setBrandColors: (colors) => set((state) => {
        state.brandColors = colors;
        state.isDirty = true;
      }),

      resetDirty: () => set({ isDirty: false }),
    }))
  )
);
```

---

## 8. HTML Export Engine

### 8.1 HTML Generation Strategy

The HTML export engine converts the section data structure into clean, Shopify-compatible HTML with embedded CSS.

```javascript
// src/utils/htmlGenerator.js

/**
 * Main HTML export function
 */
export const generateHTML = (sections, options = {}) => {
  const {
    includeStyles = true,
    minify = false,
    responsive = true,
  } = options;

  const htmlContent = sections.map(section =>
    generateSectionHTML(section)
  ).join('\n\n');

  const cssContent = includeStyles ? generateCSS(sections, responsive) : '';

  const fullHTML = `
${includeStyles ? `<style>\n${cssContent}\n</style>` : ''}

<div class="page-crafter-content">
${htmlContent}
</div>
  `.trim();

  return minify ? minifyHTML(fullHTML) : fullHTML;
};

/**
 * Generate HTML for a single section
 */
const generateSectionHTML = (section) => {
  const generator = SECTION_GENERATORS[section.type];

  if (!generator) {
    console.warn(`No generator found for section type: ${section.type}`);
    return '';
  }

  return generator(section);
};

/**
 * Section-specific HTML generators
 */
const SECTION_GENERATORS = {
  heading: (section) => {
    const { text, tag, fontSize, fontWeight, textAlign, color } = section.config;
    const className = `pc-heading pc-heading-${section.id}`;

    return `<${tag} class="${className}" style="color: ${color};">${escapeHTML(text)}</${tag}>`;
  },

  paragraph: (section) => {
    const { text, textAlign } = section.config;
    return `<p class="pc-paragraph pc-paragraph-${section.id}">${escapeHTML(text)}</p>`;
  },

  'product-highlight': (section) => {
    const { layout, image, headline, description, features, cta, backgroundColor } = section.config;

    return `
<div class="pc-product-highlight pc-section-${section.id}" style="background-color: ${backgroundColor};">
  <div class="pc-container">
    <div class="pc-product-highlight-content pc-layout-${layout}">
      <div class="pc-product-image">
        <img src="${image.url}" alt="${escapeHTML(image.alt)}" loading="lazy">
      </div>
      <div class="pc-product-details">
        <h2 class="pc-product-headline">${escapeHTML(headline)}</h2>
        <p class="pc-product-description">${escapeHTML(description)}</p>
        <ul class="pc-product-features">
          ${features.map(feature => `<li>${escapeHTML(feature)}</li>`).join('\n          ')}
        </ul>
        <a href="${cta.url}" class="pc-button pc-button-${cta.style}">${escapeHTML(cta.text)}</a>
      </div>
    </div>
  </div>
</div>`.trim();
  },

  'pros-cons': (section) => {
    const { title, pros, cons, prosLabel, consLabel } = section.config;

    return `
<div class="pc-pros-cons pc-section-${section.id}">
  <div class="pc-container">
    ${title ? `<h3 class="pc-pros-cons-title">${escapeHTML(title)}</h3>` : ''}
    <div class="pc-pros-cons-grid">
      <div class="pc-pros">
        <h4 class="pc-pros-label">${escapeHTML(prosLabel)}</h4>
        <ul class="pc-pros-list">
          ${pros.map(pro => `<li>${escapeHTML(pro)}</li>`).join('\n          ')}
        </ul>
      </div>
      <div class="pc-cons">
        <h4 class="pc-cons-label">${escapeHTML(consLabel)}</h4>
        <ul class="pc-cons-list">
          ${cons.map(con => `<li>${escapeHTML(con)}</li>`).join('\n          ')}
        </ul>
      </div>
    </div>
  </div>
</div>`.trim();
  },

  // More generators...
};

/**
 * Generate CSS for all sections
 */
const generateCSS = (sections, responsive = true) => {
  const baseCSS = getBaseCSS();
  const sectionCSS = sections.map(section =>
    generateSectionCSS(section)
  ).join('\n\n');

  const responsiveCSS = responsive ? getResponsiveCSS() : '';

  return `${baseCSS}\n\n${sectionCSS}\n\n${responsiveCSS}`;
};

/**
 * Base CSS rules
 */
const getBaseCSS = () => `
/* Page Crafter Base Styles */
.page-crafter-content {
  max-width: 100%;
  margin: 0 auto;
}

.pc-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.pc-heading {
  margin-top: 0;
  line-height: 1.2;
}

.pc-paragraph {
  line-height: 1.6;
  margin-bottom: 16px;
}

.pc-button {
  display: inline-block;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.2s;
}

.pc-button-primary {
  background-color: #3B82F6;
  color: #ffffff;
}

.pc-button-primary:hover {
  background-color: #2563EB;
}

.pc-product-highlight-content {
  display: flex;
  gap: 32px;
  align-items: center;
}

.pc-product-highlight-content.pc-layout-image-right {
  flex-direction: row-reverse;
}

.pc-product-image {
  flex: 1;
}

.pc-product-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.pc-product-details {
  flex: 1;
}

.pc-product-features {
  list-style: none;
  padding: 0;
  margin: 16px 0;
}

.pc-product-features li {
  padding-left: 24px;
  position: relative;
  margin-bottom: 8px;
}

.pc-product-features li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #10B981;
  font-weight: bold;
}

.pc-pros-cons-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.pc-pros-list, .pc-cons-list {
  list-style: none;
  padding: 0;
}

.pc-pros-list li, .pc-cons-list li {
  padding-left: 24px;
  position: relative;
  margin-bottom: 8px;
}

.pc-pros-list li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #10B981;
}

.pc-cons-list li:before {
  content: "✗";
  position: absolute;
  left: 0;
  color: #EF4444;
}
`;

/**
 * Generate section-specific CSS
 */
const generateSectionCSS = (section) => {
  const cssGenerator = SECTION_CSS_GENERATORS[section.type];
  return cssGenerator ? cssGenerator(section) : '';
};

const SECTION_CSS_GENERATORS = {
  heading: (section) => {
    const { fontSize, fontWeight, textAlign, marginTop, marginBottom } = section.config;

    return `
.pc-heading-${section.id} {
  font-size: ${getFontSizeValue(fontSize)};
  font-weight: ${getFontWeightValue(fontWeight)};
  text-align: ${textAlign};
  margin-top: ${marginTop}px;
  margin-bottom: ${marginBottom}px;
}`.trim();
  },

  'product-highlight': (section) => {
    const { padding } = section.config;

    return `
.pc-section-${section.id} {
  padding: ${padding}px 0;
}`.trim();
  },

  // More CSS generators...
};

/**
 * Responsive CSS rules
 */
const getResponsiveCSS = () => `
/* Responsive Styles */
@media (max-width: 768px) {
  .pc-product-highlight-content {
    flex-direction: column !important;
  }

  .pc-pros-cons-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .pc-button {
    display: block;
    text-align: center;
  }
}
`;

/**
 * Utility functions
 */
const escapeHTML = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

const getFontSizeValue = (size) => {
  const sizes = {
    'sm': '14px',
    'base': '16px',
    'lg': '18px',
    'xl': '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
  };
  return sizes[size] || '16px';
};

const getFontWeightValue = (weight) => {
  const weights = {
    'normal': '400',
    'medium': '500',
    'semibold': '600',
    'bold': '700',
  };
  return weights[weight] || '400';
};

const minifyHTML = (html) => {
  return html
    .replace(/\n\s*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
};
```

---

## 9. AI Integration

### 9.1 OpenAI Service

```javascript
// src/services/aiService.js (Backend)
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate content for a specific section type
 */
export const generateSectionContent = async (sectionType, productInfo, options = {}) => {
  const prompt = buildPrompt(sectionType, productInfo, options);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional e-commerce copywriter specialized in creating compelling product descriptions for Shopify stores. Generate content that is persuasive, clear, and optimized for conversions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const generatedContent = completion.choices[0].message.content;
    const parsedContent = parseAIResponse(sectionType, generatedContent);

    return {
      content: parsedContent,
      tokensUsed: completion.usage.total_tokens,
      model: completion.model,
    };

  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate content with AI');
  }
};

/**
 * Build prompt based on section type
 */
const buildPrompt = (sectionType, productInfo, options) => {
  const { name, features, specifications, targetAudience, tone = 'professional' } = productInfo;

  const prompts = {
    'product-highlight': `
Create a compelling product highlight section for: ${name}

Features: ${features.join(', ')}
Target Audience: ${targetAudience}
Tone: ${tone}

Generate the following in JSON format:
{
  "headline": "Catchy headline (max 60 characters)",
  "description": "Compelling 2-3 sentence description (max 200 characters)",
  "features": ["Feature 1 benefit", "Feature 2 benefit", "Feature 3 benefit"],
  "cta": "Call-to-action button text (max 20 characters)"
}
    `,

    'pros-cons': `
Create an honest pros and cons list for: ${name}

Features: ${features.join(', ')}
Specifications: ${JSON.stringify(specifications)}

Generate the following in JSON format:
{
  "title": "Section title (optional)",
  "pros": ["Pro 1", "Pro 2", "Pro 3", "Pro 4"],
  "cons": ["Con 1", "Con 2"]
}

Be balanced and realistic. Include 3-5 pros and 1-3 cons.
    `,

    'paragraph': `
Write a compelling paragraph about: ${name}

Context: ${options.context || 'Product description'}
Tone: ${tone}
Length: ${options.length || 'medium'} (short: 50-75 words, medium: 75-125 words, long: 125-200 words)

Write engaging, benefit-focused copy that persuades the reader.
    `,
  };

  return prompts[sectionType] || prompts['paragraph'];
};

/**
 * Parse AI response based on section type
 */
const parseAIResponse = (sectionType, response) => {
  try {
    // Try to parse as JSON first
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.warn('Failed to parse AI response as JSON, returning raw text');
  }

  // Fallback: return raw text
  return { text: response.trim() };
};

/**
 * Generate full page description
 */
export const generatePageDescription = async (productInfo) => {
  const prompt = `
Create a complete product page description for an e-commerce store.

Product: ${productInfo.name}
Category: ${productInfo.category}
Key Features: ${productInfo.features.join(', ')}
Target Audience: ${productInfo.targetAudience}
Unique Selling Points: ${productInfo.usp}

Generate a structured product page with the following sections (in JSON format):

{
  "hero": {
    "headline": "Main headline",
    "subheadline": "Supporting headline",
    "description": "2-3 sentence overview"
  },
  "features": [
    {"title": "Feature 1", "description": "Benefit description"},
    {"title": "Feature 2", "description": "Benefit description"},
    {"title": "Feature 3", "description": "Benefit description"}
  ],
  "proscons": {
    "pros": ["Pro 1", "Pro 2", "Pro 3"],
    "cons": ["Con 1", "Con 2"]
  },
  "specifications": [
    {"label": "Spec 1", "value": "Value 1"},
    {"label": "Spec 2", "value": "Value 2"}
  ]
}
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a professional e-commerce copywriter.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0].message.content;
    const jsonMatch = response.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Failed to parse AI response');

  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};
```

---

## 10. Security Architecture

### 10.1 Input Sanitization

```javascript
// src/middleware/validation.js
import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

/**
 * Sanitize HTML content
 */
export const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['class'],
  });
};

/**
 * Validate and sanitize URL
 */
export const sanitizeURL = (url) => {
  if (!validator.isURL(url, { protocols: ['http', 'https'], require_protocol: true })) {
    throw new Error('Invalid URL');
  }
  return validator.escape(url);
};

/**
 * Sanitize color hex code
 */
export const sanitizeColor = (color) => {
  if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
    throw new Error('Invalid color format');
  }
  return color;
};

/**
 * Validate file upload
 */
export const validateFileUpload = (file) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error('Invalid file type. Only JPG, PNG, and WebP are allowed.');
  }

  if (file.size > maxSize) {
    throw new Error('File size exceeds 5MB limit.');
  }

  return true;
};
```

### 10.2 Rate Limiting

```javascript
// src/middleware/rateLimit.js
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit each IP to 50 AI requests per hour
  message: 'AI request limit exceeded. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
```

---

## 11. Performance Optimization

### 11.1 Frontend Performance

**Code Splitting**:
```javascript
// src/App.jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/ui/LoadingSpinner';

const EditorPage = lazy(() => import('./pages/EditorPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const TemplatesPage = lazy(() => import('./pages/TemplatesPage'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<ProjectsPage />} />
          <Route path="/editor/:id" element={<EditorPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

**Virtualization for Large Lists**:
```javascript
// src/components/editor/SectionList.jsx
import { useVirtualizer } from '@tanstack/react-virtual';

const SectionList = ({ sections }) => {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: sections.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="section-list">
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <SectionRenderer section={sections[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 11.2 Backend Performance

**MongoDB Indexing**:
```javascript
// Ensure indexes are created
projectSchema.index({ createdAt: -1 });
projectSchema.index({ updatedAt: -1 });
projectSchema.index({ name: 'text' });
templateSchema.index({ category: 1, usageCount: -1 });
```

**Caching**:
```javascript
// src/middleware/cache.js
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

export const cacheMiddleware = (duration = 600) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    res.originalJson = res.json;
    res.json = (body) => {
      cache.set(key, body, duration);
      res.originalJson(body);
    };

    next();
  };
};
```

---

## 12. Deployment Architecture

### 12.1 Local Development Setup

```bash
# Directory structure
product-description-builder/
├── frontend/          # React app (Port 3000)
├── backend/           # Express server (Port 5000)
└── docker-compose.yml # Docker setup (optional)
```

### 12.2 Environment Configuration

**Frontend (.env)**:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Page Crafter
VITE_APP_VERSION=1.0.0
```

**Backend (.env)**:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/page-crafter
OPENAI_API_KEY=your_openai_api_key_here
FRONTEND_URL=http://localhost:3000
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

### 12.3 Docker Setup (Optional)

```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    container_name: page-crafter-db
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: page-crafter

  backend:
    build: ./backend
    container_name: page-crafter-backend
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/page-crafter
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    container_name: page-crafter-frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  mongodb_data:
```

---

## 13. Testing Strategy

### 13.1 Unit Testing

```javascript
// src/utils/__tests__/htmlGenerator.test.js
import { describe, it, expect } from 'vitest';
import { generateHTML, generateSectionHTML } from '../htmlGenerator';

describe('HTML Generator', () => {
  it('should generate HTML for heading section', () => {
    const section = {
      id: 'test-1',
      type: 'heading',
      config: {
        text: 'Test Heading',
        tag: 'h2',
        color: '#000000',
      }
    };

    const html = generateSectionHTML(section);
    expect(html).toContain('<h2');
    expect(html).toContain('Test Heading');
    expect(html).toContain('color: #000000');
  });

  it('should escape HTML in user content', () => {
    const section = {
      id: 'test-2',
      type: 'paragraph',
      config: {
        text: '<script>alert("xss")</script>',
      }
    };

    const html = generateSectionHTML(section);
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });
});
```

### 13.2 Integration Testing

```javascript
// backend/src/__tests__/project.test.js
import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../app';
import { connectDatabase } from '../config/database';
import mongoose from 'mongoose';

describe('Project API', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new project', async () => {
    const response = await request(app)
      .post('/api/projects')
      .send({
        name: 'Test Project',
        description: 'Test description',
        sections: [],
        brandColors: ['#3B82F6']
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('Test Project');
  });

  it('should get all projects', async () => {
    const response = await request(app).get('/api/projects');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
```

---

## 14. Appendices

### 14.1 Technology Decision Rationale

| Technology | Chosen | Rationale |
|------------|--------|-----------|
| Frontend Framework | React | Large ecosystem, component-based, excellent DnD libraries |
| Build Tool | Vite | Fast HMR, modern, better DX than CRA |
| Styling | TailwindCSS | Utility-first, rapid development, consistent design |
| Drag & Drop | @dnd-kit | Modern, accessible, better than react-dnd |
| State Management | Zustand | Lightweight, simple API, less boilerplate than Redux |
| Backend | Express.js | Minimal, flexible, large ecosystem |
| Database | MongoDB | Schema-less fits dynamic section structure, easy scaling |
| AI | OpenAI GPT-4 | Best-in-class language model, reliable API |

### 14.2 Performance Benchmarks

| Metric | Target | Measurement |
|--------|--------|-------------|
| Initial Load Time | < 2s | Lighthouse performance score |
| Preview Update | < 100ms | Custom performance timing |
| HTML Export | < 1s | Time from click to copy |
| AI Generation | < 5s | API request duration |
| Auto-save | Every 30s | Debounced save trigger |

### 14.3 Browser Compatibility Matrix

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 100+ | ✅ Fully Supported |
| Firefox | 100+ | ✅ Fully Supported |
| Safari | 15+ | ✅ Fully Supported |
| Edge | 100+ | ✅ Fully Supported |
| Opera | Latest | ⚠️ Best Effort |

---

**End of Document**
