# Page Crafter - Development Roadmap

## Document Information
- **Version**: 1.0
- **Last Updated**: 2025-10-25
- **Status**: Draft
- **Timeline**: 8 weeks to MVP

---

## Table of Contents
1. [Overview](#1-overview)
2. [Phase 0: Setup & Planning](#2-phase-0-setup--planning)
3. [Phase 1: Foundation](#3-phase-1-foundation)
4. [Phase 2: Core Editor](#4-phase-2-core-editor)
5. [Phase 3: AI Integration](#5-phase-3-ai-integration)
6. [Phase 4: Templates & Export](#6-phase-4-templates--export)
7. [Phase 5: Polish & Testing](#7-phase-5-polish--testing)
8. [Phase 6: Launch](#8-phase-6-launch)
9. [Post-MVP Roadmap](#9-post-mvp-roadmap)
10. [Risk Management](#10-risk-management)

---

## 1. Overview

### 1.1 Development Timeline

```
Week 1-2: Foundation & Backend
Week 3-4: Core Editor & Sections
Week 5-6: AI & Templates
Week 7: Export & Integration
Week 8: Testing, Polish & Launch
```

### 1.2 Team Structure

**Recommended Team**:
- 1 Full-Stack Developer (Primary)
- 1 Frontend Developer (Optional)
- 1 Designer/UX (Part-time)
- 1 QA Tester (Week 7-8)

**Solo Developer**: 8-10 weeks

### 1.3 Technology Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | React 18+ Vite, TailwindCSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| AI | OpenAI GPT-4 |
| DnD | @dnd-kit |
| State | Zustand |
| Testing | Vitest, React Testing Library |

---

## 2. Phase 0: Setup & Planning
**Duration**: 3-5 days

### Goals
- Set up development environment
- Initialize repositories
- Create project structure
- Set up CI/CD basics

### Tasks

#### Day 1: Project Initialization
- [ ] Create GitHub repository
- [ ] Initialize frontend project with Vite
  ```bash
  npm create vite@latest frontend -- --template react
  cd frontend
  npm install
  ```
- [ ] Initialize backend project
  ```bash
  mkdir backend && cd backend
  npm init -y
  npm install express mongoose dotenv cors
  ```
- [ ] Set up MongoDB (local or MongoDB Atlas)
- [ ] Create `.gitignore` files
- [ ] Set up ESLint and Prettier
- [ ] Create `README.md` with setup instructions

#### Day 2: Frontend Setup
- [ ] Install dependencies:
  ```bash
  npm install @dnd-kit/core @dnd-kit/sortable zustand axios react-router-dom
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```
- [ ] Configure TailwindCSS
- [ ] Create basic folder structure (components, pages, hooks, etc.)
- [ ] Set up routing (React Router)
- [ ] Create base UI components (Button, Input, Modal)

#### Day 3: Backend Setup
- [ ] Set up Express server
- [ ] Connect to MongoDB
- [ ] Create Mongoose models (Project, Template)
- [ ] Set up middleware (CORS, error handling, validation)
- [ ] Create basic API routes structure
- [ ] Test server with Postman

#### Day 4-5: Environment & Documentation
- [ ] Set up environment variables (.env files)
- [ ] Configure OpenAI API access
- [ ] Create API documentation structure
- [ ] Set up hot reload for development
- [ ] Create initial database seed data
- [ ] Test end-to-end connectivity (frontend → backend → database)

**Deliverables**:
- ✅ Development environment ready
- ✅ Frontend and backend running locally
- ✅ Database connected
- ✅ Basic folder structure in place

---

## 3. Phase 1: Foundation
**Duration**: Week 1-2 (10 days)

### Goals
- Build backend API
- Create data models
- Set up state management
- Build project management UI

### Week 1: Backend Foundation

#### Day 1-2: Database Models & API
- [ ] **Project Model**
  - Schema design
  - Validation rules
  - Indexes
- [ ] **Template Model**
  - Schema design
  - Relationship with Project
- [ ] **Project API Endpoints**
  - POST /api/projects (create)
  - GET /api/projects (list with pagination)
  - GET /api/projects/:id (get by ID)
  - PUT /api/projects/:id (update)
  - DELETE /api/projects/:id (delete)
- [ ] **Unit tests for models**
- [ ] **Integration tests for API**

#### Day 3-4: Template API & File Upload
- [ ] **Template API Endpoints**
  - POST /api/templates (create)
  - GET /api/templates (list with filters)
  - GET /api/templates/:id (get by ID)
  - PUT /api/templates/:id (update)
  - DELETE /api/templates/:id (delete)
- [ ] **File Upload**
  - Multer configuration
  - Image validation
  - File storage setup
  - POST /api/upload/image
- [ ] **API documentation** (Postman/Swagger)

#### Day 5: Testing & Security
- [ ] Input sanitization
- [ ] Rate limiting
- [ ] Error handling middleware
- [ ] API tests
- [ ] Security audit

### Week 2: Frontend Foundation

#### Day 6-7: Project Management UI
- [ ] **Dashboard Page**
  - Project list/grid view
  - Search functionality
  - Filter by status
  - Pagination
- [ ] **Create Project Modal**
  - Form with validation
  - Brand color picker
  - API integration
- [ ] **Project Card Component**
  - Thumbnail
  - Last modified date
  - Actions (edit, delete, duplicate)
- [ ] **State Management**
  - Zustand store for projects
  - API service layer (axios)
  - Error handling

#### Day 8-9: Routing & Navigation
- [ ] **React Router setup**
  - / (Dashboard)
  - /editor/:id (Editor)
  - /templates (Template Library)
- [ ] **Navigation Component**
  - Header with logo
  - Navigation links
  - User menu placeholder
- [ ] **Loading States**
  - Skeleton loaders
  - Spinners
  - Empty states

#### Day 10: Polish & Testing
- [ ] Responsive design (mobile/tablet)
- [ ] Accessibility improvements
- [ ] Component tests
- [ ] E2E test for project creation
- [ ] Bug fixes

**Deliverables**:
- ✅ Full backend API operational
- ✅ Project management UI working
- ✅ Create, view, delete projects
- ✅ Basic navigation in place

---

## 4. Phase 2: Core Editor
**Duration**: Week 3-4 (10 days)

### Goals
- Build drag-and-drop editor
- Implement 10-15 core section types
- Add preview functionality
- Implement auto-save

### Week 3: Editor Infrastructure

#### Day 11-12: Editor Layout & Drag-and-Drop
- [ ] **Editor Page Layout**
  - Three-column layout (Library | Canvas | Settings)
  - Responsive adjustments
- [ ] **Section Library Component**
  - Categorized sections (Basic, Product, Columns, Media, Advanced)
  - Search/filter sections
  - Draggable section items
- [ ] **Canvas Component**
  - Drop zone setup
  - Section rendering
  - Selection handling
- [ ] **Drag & Drop Implementation** (@dnd-kit)
  - DragContext setup
  - Add section from library
  - Reorder sections
  - Visual feedback (ghost images, placeholders)

#### Day 13-14: Basic Section Components
- [ ] **Heading Section**
  - Component
  - Settings panel (font size, weight, alignment, color)
  - Real-time preview
- [ ] **Paragraph Section**
  - Rich text editor (TipTap)
  - Formatting toolbar
  - Settings panel
- [ ] **Media Section**
  - Image upload
  - URL input
  - Alt text
  - Size controls
- [ ] **Button Section**
  - Label and URL
  - Style variants
  - Color customization
- [ ] **Spacer Section**
  - Height control
  - Visual indicator
- [ ] **Divider Section**
  - Style options
  - Width control

#### Day 15: Settings Panel & State Management
- [ ] **Settings Panel Component**
  - Dynamic based on selected section
  - Form controls (text, color picker, select, slider)
  - Real-time updates
- [ ] **Editor State Management** (Zustand)
  - Sections array
  - Selected section
  - History (undo/redo)
  - Auto-save logic
- [ ] **Section Configuration System**
  - Section schemas/registry
  - Default configs
  - Validation

### Week 4: Advanced Sections & Preview

#### Day 16-17: Product Section Components
- [ ] **Product Highlight Section**
  - Image + text layout
  - Layout variants (left/right)
  - Feature list
  - CTA button
  - Background customization
- [ ] **Pros & Cons Section**
  - Two-column layout
  - Add/remove items
  - Custom labels
  - Icon indicators
- [ ] **Specification Table Section**
  - Label-value pairs
  - Add/remove rows
  - Styling options
- [ ] **Product Features Section**
  - Icon + title + description blocks
  - Grid layout (2-4 columns)
  - Responsive behavior

#### Day 18: Column & Media Sections
- [ ] **Two Column Section**
  - Image + text side-by-side
  - Swap positions
  - Responsive stacking
- [ ] **Three Column Section**
  - Equal columns
  - Image + title + text per column
- [ ] **Gallery Section**
  - Grid of images
  - Gap controls
  - Responsive grid

#### Day 19: Advanced Sections
- [ ] **Accordion Section**
  - Expandable items
  - Add/remove items
  - Default state option
  - Smooth animations
- [ ] **Rating Section**
  - Star rating display
  - Numeric input
  - Color customization

#### Day 20: Preview & Editor Features
- [ ] **Preview Mode**
  - Toggle edit/preview
  - Desktop/mobile toggle
  - Accurate rendering
- [ ] **Toolbar**
  - Undo/redo buttons
  - Save button
  - Device toggle
  - Export button (placeholder)
- [ ] **Keyboard Shortcuts**
  - Ctrl+S (save)
  - Ctrl+Z (undo)
  - Ctrl+Y (redo)
  - Delete (remove section)
- [ ] **Auto-Save**
  - Debounced save (30s)
  - LocalStorage backup
  - Save status indicator
- [ ] **Testing & Bug Fixes**

**Deliverables**:
- ✅ Fully functional drag-and-drop editor
- ✅ 10-15 working section components
- ✅ Preview mode operational
- ✅ Auto-save working

---

## 5. Phase 3: AI Integration
**Duration**: Week 5 (5 days)

### Goals
- Integrate OpenAI API
- Implement AI content generation
- Add AI UI components
- Handle errors gracefully

#### Day 21-22: Backend AI Service
- [ ] **OpenAI Integration**
  - OpenAI SDK setup
  - API key configuration
  - Rate limiting for AI endpoints
- [ ] **AI Service Layer**
  - generateSectionContent()
  - generateFullPage()
  - refineContent()
  - Prompt templates for each section type
- [ ] **AI API Endpoints**
  - POST /api/ai/generate-section
  - POST /api/ai/generate-page
  - POST /api/ai/refine
- [ ] **Error Handling**
  - OpenAI API errors
  - Rate limit exceeded
  - Timeout handling
- [ ] **Testing**
  - Mock OpenAI responses
  - Test each section type generation
  - Test error scenarios

#### Day 23-24: Frontend AI Features
- [ ] **AI Generation UI**
  - "Generate with AI" button in settings panel
  - AI generation modal/form
  - Product info input fields
  - Tone selection
  - Loading state during generation
- [ ] **AI Content Display**
  - Preview AI-generated content
  - Accept/reject buttons
  - Regenerate option
  - Edit after acceptance
- [ ] **Full Page Generation**
  - "Generate Page with AI" option in project creation
  - Comprehensive product info form
  - Multi-section generation preview
  - Section-by-section review
- [ ] **AI Service (Frontend)**
  - API calls with axios
  - Response parsing
  - Error handling UI

#### Day 25: Testing & Polish
- [ ] **User Testing**
  - Test AI generation for various products
  - Verify prompt quality
  - Check response times
- [ ] **Refinement**
  - Improve prompts based on output quality
  - Add more prompt templates
  - Optimize for speed
- [ ] **Error UX**
  - User-friendly error messages
  - Retry mechanisms
  - Fallback to manual editing
- [ ] **Documentation**
  - AI feature usage guide
  - Best practices for prompts

**Deliverables**:
- ✅ AI content generation working for all section types
- ✅ Full page generation operational
- ✅ Error handling robust
- ✅ User-friendly AI UI

---

## 6. Phase 4: Templates & Export
**Duration**: Week 6 (5 days)

### Goals
- Build template system
- Implement HTML export engine
- Create pre-built templates
- Test Shopify compatibility

#### Day 26-27: Template System
- [ ] **Save as Template**
  - "Save as Template" button
  - Template metadata form (name, description, category)
  - Save current sections to template
  - Thumbnail generation (screenshot)
- [ ] **Template Library Page**
  - Grid view of templates
  - Filter by category
  - Search functionality
  - Featured templates
- [ ] **Template Preview**
  - Quick preview on hover
  - Full preview modal
  - Section list view
- [ ] **Use Template**
  - "Use Template" button
  - Load template into new project
  - Replace existing project (with confirmation)
  - Template usage tracking
- [ ] **Pre-Built Templates**
  - Create 5-7 high-quality templates
  - Categories: Tech, Fashion, Home, General
  - Mark as featured

#### Day 28-29: HTML Export Engine
- [ ] **HTML Generator**
  - Section-to-HTML conversion
  - Semantic HTML5 markup
  - Proper escaping and sanitization
- [ ] **CSS Generator**
  - Base styles
  - Section-specific styles
  - Responsive CSS (@media queries)
  - Minification option
- [ ] **Export API Endpoint**
  - POST /api/projects/:id/export
  - Options (minify, include styles, responsive)
  - Return generated HTML
- [ ] **Export UI**
  - "Export HTML" button
  - Export modal with code preview
  - Syntax highlighting
  - "Copy to Clipboard" button
  - Download as .html file option
- [ ] **Testing**
  - Test with all section types
  - Validate HTML (W3C validator)
  - Test in Shopify product description

#### Day 30: Shopify Integration Testing
- [ ] **Shopify Compatibility**
  - Test HTML in Shopify Online Store 2.0 theme
  - Verify responsive behavior
  - Check CSS conflicts
  - Test on actual product pages
- [ ] **Adjustments**
  - Fix any rendering issues
  - Adjust CSS specificity if needed
  - Add Shopify-specific optimizations
- [ ] **Documentation**
  - Create guide "How to Add to Shopify"
  - Troubleshooting common issues
  - Video tutorial (optional)

**Deliverables**:
- ✅ Template system fully functional
- ✅ 5-7 pre-built templates available
- ✅ HTML export generates clean, valid code
- ✅ Verified Shopify compatibility

---

## 7. Phase 5: Polish & Testing
**Duration**: Week 7 (5 days)

### Goals
- Comprehensive testing
- Bug fixes
- Performance optimization
- UX improvements

#### Day 31-32: Testing

**Unit Testing**:
- [ ] Test all utility functions
- [ ] Test state management logic
- [ ] Test API services
- [ ] Test HTML/CSS generators
- [ ] Achieve >70% code coverage

**Integration Testing**:
- [ ] Test API endpoints with Postman
- [ ] Test frontend-backend integration
- [ ] Test database operations
- [ ] Test file uploads

**E2E Testing**:
- [ ] Test complete user flows:
  - Create project from scratch
  - Use template
  - Generate with AI
  - Export HTML
  - Copy to Shopify
- [ ] Test edge cases (empty projects, large projects, etc.)

**Cross-Browser Testing**:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

**Responsive Testing**:
- [ ] Mobile (375px, 414px)
- [ ] Tablet (768px, 1024px)
- [ ] Desktop (1920px, 2560px)

#### Day 33-34: Bug Fixes & Optimization

**Bug Triage**:
- [ ] Prioritize bugs (critical, high, medium, low)
- [ ] Fix all critical and high priority bugs
- [ ] Address medium priority if time allows

**Performance Optimization**:
- [ ] Frontend bundle size optimization (code splitting)
- [ ] Image optimization (lazy loading, compression)
- [ ] Database query optimization (indexes, pagination)
- [ ] Caching strategy (API responses, templates)
- [ ] Reduce AI API calls (caching, debouncing)

**Performance Metrics**:
- [ ] Lighthouse audit (score > 90)
- [ ] Page load time < 2s
- [ ] Time to interactive < 3s
- [ ] First contentful paint < 1.5s

#### Day 35: UX Polish

**UI Improvements**:
- [ ] Consistent spacing and alignment
- [ ] Smooth animations and transitions
- [ ] Loading states everywhere
- [ ] Empty states with helpful messages
- [ ] Error states with recovery actions

**Accessibility**:
- [ ] Keyboard navigation
- [ ] ARIA labels
- [ ] Focus indicators
- [ ] Screen reader testing
- [ ] Color contrast check (WCAG AA)

**Tooltips & Help**:
- [ ] Add tooltips to all icons and buttons
- [ ] Contextual help text
- [ ] Onboarding tour (optional)
- [ ] FAQ page

**Deliverables**:
- ✅ All critical bugs fixed
- ✅ Performance optimized
- ✅ Excellent UX and accessibility
- ✅ Ready for launch

---

## 8. Phase 6: Launch
**Duration**: Week 8 (5 days)

### Goals
- Final preparations
- Deployment
- Launch
- Monitoring

#### Day 36-37: Pre-Launch

**Final Testing**:
- [ ] Complete QA pass
- [ ] User acceptance testing (5-10 users)
- [ ] Smoke testing all features
- [ ] Security audit

**Documentation**:
- [ ] User guide / Help center
- [ ] Video tutorials
- [ ] API documentation (if needed)
- [ ] README with setup instructions

**Deployment Prep**:
- [ ] Environment variables for production
- [ ] Database backup strategy
- [ ] Error logging setup (Sentry or similar)
- [ ] Analytics setup (Google Analytics, Mixpanel)
- [ ] Monitoring setup (Uptime Robot, New Relic)

#### Day 38: Deployment

**Backend Deployment** (if moving to production):
- [ ] Choose hosting (Heroku, DigitalOcean, AWS, Vercel)
- [ ] Set up production database (MongoDB Atlas)
- [ ] Configure environment variables
- [ ] Deploy backend
- [ ] Test production API

**Frontend Deployment**:
- [ ] Build production bundle
- [ ] Deploy to hosting (Vercel, Netlify, AWS S3)
- [ ] Configure domain (if applicable)
- [ ] Test production site

**Post-Deployment**:
- [ ] Smoke test all features in production
- [ ] Monitor for errors
- [ ] Check performance metrics

#### Day 39-40: Launch & Monitoring

**Soft Launch**:
- [ ] Invite beta users (10-20 people)
- [ ] Monitor usage and errors
- [ ] Gather feedback
- [ ] Hot fixes if needed

**Monitoring**:
- [ ] Watch error logs
- [ ] Monitor server performance
- [ ] Track user behavior (analytics)
- [ ] Monitor AI API usage and costs

**Marketing** (optional):
- [ ] Social media announcement
- [ ] Product Hunt launch
- [ ] Email to interested users
- [ ] Demo video

**Deliverables**:
- ✅ Live production application
- ✅ Stable and monitored
- ✅ User feedback collected
- ✅ MVP launched successfully

---

## 9. Post-MVP Roadmap

### Phase 7: Enhancements (Week 9-12)

**Priority Features**:
1. **Shopify App Integration**
   - Direct publish to Shopify (no copy/paste)
   - OAuth authentication
   - Shopify App Bridge
   - Auto-sync product info

2. **User Authentication**
   - User registration and login
   - Project ownership
   - Private/shared templates
   - User profiles

3. **Advanced Sections**
   - Video embed section
   - Testimonial carousel
   - Product comparison table
   - Before/after slider
   - Interactive sections

4. **Collaboration Features**
   - Share projects with team
   - Comments on sections
   - Version history
   - Approval workflows

5. **Analytics**
   - Template usage analytics
   - Popular sections tracking
   - AI usage statistics
   - User engagement metrics

### Phase 8: Scaling (Month 4-6)

**Infrastructure**:
- Multi-region deployment
- CDN for assets
- Caching layer (Redis)
- Database sharding
- Load balancing

**Features**:
- Template marketplace
- Custom component builder
- A/B testing integration
- SEO optimization tools
- Multilingual support

**AI Enhancements**:
- Fine-tuned models for e-commerce
- Industry-specific prompts
- AI-powered A/B test suggestions
- Auto-optimize content for SEO

### Phase 9: Enterprise (Month 6-12)

**Enterprise Features**:
- White-label solution
- API access for integrations
- Advanced permissions (roles, teams)
- Custom branding
- SLA guarantees
- Dedicated support

**Integrations**:
- WooCommerce
- BigCommerce
- Magento
- Squarespace
- Other e-commerce platforms

---

## 10. Risk Management

### High-Risk Items

#### Risk 1: OpenAI API Reliability
**Impact**: High | **Probability**: Medium

**Mitigation**:
- Implement retry logic with exponential backoff
- Cache AI responses when possible
- Queue AI requests during high load
- Fallback to manual editing
- Monitor OpenAI status page
- Consider alternative AI providers (Anthropic, Cohere)

**Contingency**:
- If OpenAI down, show clear message and queue requests
- Allow users to continue with manual editing

---

#### Risk 2: Drag & Drop Performance
**Impact**: Medium | **Probability**: Low

**Mitigation**:
- Use efficient DnD library (@dnd-kit)
- Virtualize long lists
- Debounce expensive operations
- Profile and optimize render cycles
- Test with 50+ sections

**Contingency**:
- If performance issues, simplify animations
- Add "simple mode" with less visual effects

---

#### Risk 3: Shopify Compatibility Issues
**Impact**: High | **Probability**: Medium

**Mitigation**:
- Test early and often in Shopify
- Follow Shopify HTML/CSS best practices
- Avoid external dependencies
- Use inline styles or namespaced classes
- Test across multiple themes

**Contingency**:
- Provide troubleshooting guide
- Offer "safe mode" export with minimal CSS
- Support tickets for compatibility issues

---

#### Risk 4: Scope Creep
**Impact**: High | **Probability**: High

**Mitigation**:
- Strictly prioritize features (P0, P1, P2)
- Review scope weekly
- Say "no" to non-MVP features
- Document "future enhancements" but don't build yet
- Time-box feature development

**Contingency**:
- If behind schedule, cut P1 and P2 features
- Focus on core MVP: create, edit, AI generate, export

---

#### Risk 5: AI Content Quality
**Impact**: Medium | **Probability**: Medium

**Mitigation**:
- Invest time in prompt engineering
- Test with diverse products
- Gather user feedback early
- Iterate on prompts based on feedback
- Allow users to provide context

**Contingency**:
- If AI quality low, make manual editing seamless
- Provide prompt templates users can customize
- Consider human review service (future)

---

### Timeline Buffers

**Built-in Buffer**: 20% additional time for unexpected issues

| Phase | Planned | Buffer | Total |
|-------|---------|--------|-------|
| Phase 0-1 | 12 days | 2 days | 14 days |
| Phase 2 | 10 days | 2 days | 12 days |
| Phase 3 | 5 days | 1 day | 6 days |
| Phase 4 | 5 days | 1 day | 6 days |
| Phase 5 | 5 days | 1 day | 6 days |
| Phase 6 | 5 days | 1 day | 6 days |
| **Total** | **42 days** | **8 days** | **50 days (10 weeks)** |

---

## 11. Success Criteria

### MVP Launch Success

**Must Have**:
- ✅ Users can create projects
- ✅ Users can drag and drop 10+ section types
- ✅ AI generates usable content for all section types
- ✅ Templates save and load correctly
- ✅ HTML export works in Shopify without modifications
- ✅ No critical bugs
- ✅ Performance meets targets (< 2s load time)

**Metrics**:
- 10 beta users successfully create and deploy product pages
- 80%+ satisfaction score
- < 5 bugs reported per user
- Average time to create page: < 15 minutes

---

## 12. Decision Log

### Key Architectural Decisions

| Date | Decision | Rationale | Alternatives Considered |
|------|----------|-----------|------------------------|
| 2025-10-25 | Use React + Vite | Modern, fast HMR | Next.js (overkill for MVP) |
| 2025-10-25 | Use @dnd-kit | Modern, accessible | react-dnd (legacy), react-beautiful-dnd (unmaintained) |
| 2025-10-25 | Use Zustand | Lightweight, simple API | Redux (too complex), Context (performance issues) |
| 2025-10-25 | Use MongoDB | Flexible schema for dynamic sections | PostgreSQL (rigid schema) |
| 2025-10-25 | Inline styles in export | Maximum Shopify compatibility | External CSS (might be blocked) |

---

## 13. Appendix

### 13.1 Dependencies

**Frontend**:
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "zustand": "^4.4.7",
    "axios": "^1.6.2",
    "@tiptap/react": "^2.1.13",
    "react-color": "^2.19.3",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "vitest": "^1.0.4",
    "@testing-library/react": "^14.1.2",
    "eslint": "^8.55.0",
    "prettier": "^3.1.1"
  }
}
```

**Backend**:
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "multer": "^1.4.5-lts.1",
    "openai": "^4.20.1",
    "joi": "^17.11.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "supertest": "^6.3.3",
    "jest": "^29.7.0"
  }
}
```

---

### 13.2 MVP Feature Checklist

**Core Features**:
- [ ] Project CRUD (create, read, update, delete)
- [ ] 10-15 section components
- [ ] Drag-and-drop editor
- [ ] Settings panel for customization
- [ ] Real-time preview (desktop/mobile)
- [ ] AI content generation
- [ ] Template save/load
- [ ] Pre-built templates (5-7)
- [ ] HTML export with CSS
- [ ] Copy to clipboard
- [ ] Auto-save
- [ ] Undo/redo
- [ ] Responsive design
- [ ] Cross-browser compatibility
- [ ] Shopify compatibility verified

**Quality Gates**:
- [ ] All P0 user stories completed
- [ ] No critical bugs
- [ ] Performance targets met
- [ ] Accessibility (WCAG AA)
- [ ] Security audit passed
- [ ] User testing completed (5+ users)
- [ ] Documentation complete

---

**End of Document**
