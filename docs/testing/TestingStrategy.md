# Page Crafter - Testing Strategy

## Document Information
- **Version**: 1.0
- **Last Updated**: 2025-10-25
- **Status**: Draft

---

## 1. Testing Overview

### 1.1 Testing Pyramid

```
                    /\
                   /  \  E2E (10%)
                  /____\
                 /      \  Integration (30%)
                /________\
               /          \  Unit (60%)
              /__________\
```

### 1.2 Testing Goals
- Achieve >70% code coverage
- Zero critical bugs at launch
- All user flows tested end-to-end
- Cross-browser compatibility verified
- Performance benchmarks met

---

## 2. Unit Testing

### 2.1 Frontend Unit Tests

**Test Framework**: Vitest + React Testing Library

**What to Test**:
- Utility functions (htmlGenerator, cssGenerator, validators)
- Custom hooks (useEditor, useAutoSave, useAI)
- Pure components (Button, Input, ColorPicker)
- State management logic (Zustand stores)
- Section config schemas

**Example Test**:
```javascript
// src/utils/__tests__/htmlGenerator.test.js
import { describe, it, expect } from 'vitest';
import { generateSectionHTML } from '../htmlGenerator';

describe('HTML Generator', () => {
  it('should generate heading HTML correctly', () => {
    const section = {
      id: 'test-1',
      type: 'heading',
      config: { text: 'Test Heading', tag: 'h2', color: '#000' }
    };

    const html = generateSectionHTML(section);

    expect(html).toContain('<h2');
    expect(html).toContain('Test Heading');
    expect(html).toContain('color: #000');
  });

  it('should escape HTML in user content', () => {
    const section = {
      id: 'test-2',
      type: 'paragraph',
      config: { text: '<script>alert("xss")</script>' }
    };

    const html = generateSectionHTML(section);

    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });
});
```

**Coverage Target**: >80% for utility functions and business logic

---

### 2.2 Backend Unit Tests

**Test Framework**: Jest + Supertest

**What to Test**:
- Model methods and validations
- Service layer functions (aiService, htmlService)
- Utility functions
- Middleware

**Example Test**:
```javascript
// backend/src/__tests__/models/Project.test.js
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import mongoose from 'mongoose';
import Project from '../../models/Project.js';

describe('Project Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a valid project', async () => {
    const projectData = {
      name: 'Test Project',
      sections: [],
      brandColors: ['#3B82F6']
    };

    const project = new Project(projectData);
    const savedProject = await project.save();

    expect(savedProject.name).toBe('Test Project');
    expect(savedProject.isDraft).toBe(true);
    expect(savedProject.metadata.sectionCount).toBe(0);
  });

  it('should fail validation for invalid data', async () => {
    const invalidProject = new Project({ sections: [] }); // missing required name

    await expect(invalidProject.save()).rejects.toThrow();
  });
});
```

---

## 3. Integration Testing

### 3.1 API Integration Tests

**Test Framework**: Jest + Supertest

**What to Test**:
- API endpoints (request/response)
- Database operations
- Authentication (future)
- File uploads
- Error handling

**Example Test**:
```javascript
// backend/src/__tests__/integration/projects.test.js
import request from 'supertest';
import app from '../../app.js';

describe('Project API Integration', () => {
  let projectId;

  it('POST /api/projects - should create new project', async () => {
    const response = await request(app)
      .post('/api/projects')
      .send({
        name: 'Integration Test Project',
        brandColors: ['#3B82F6']
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('Integration Test Project');

    projectId = response.body.data.id;
  });

  it('GET /api/projects/:id - should retrieve project', async () => {
    const response = await request(app).get(`/api/projects/${projectId}`);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(projectId);
  });

  it('DELETE /api/projects/:id - should delete project', async () => {
    const response = await request(app).delete(`/api/projects/${projectId}`);

    expect(response.status).toBe(200);

    // Verify deletion
    const getResponse = await request(app).get(`/api/projects/${projectId}`);
    expect(getResponse.status).toBe(404);
  });
});
```

---

### 3.2 Frontend-Backend Integration

**What to Test**:
- API service layer
- Data flow (frontend → backend → database)
- Error handling across layers
- Loading states

---

## 4. End-to-End (E2E) Testing

### 4.1 E2E Test Scenarios

**Test Framework**: Playwright or Cypress (recommended)

**Critical User Flows**:
1. Create project from scratch
2. Use template to create project
3. Generate content with AI
4. Export HTML and copy to clipboard
5. Save project as template

**Example E2E Test** (Playwright):
```javascript
// e2e/createProject.spec.js
import { test, expect } from '@playwright/test';

test.describe('Create Product Page Flow', () => {
  test('should create a complete product page', async ({ page }) => {
    // Navigate to app
    await page.goto('http://localhost:3000');

    // Create new project
    await page.click('text=New Project');
    await page.fill('input[name="name"]', 'E2E Test Product');
    await page.click('button:has-text("Create")');

    // Wait for editor to load
    await expect(page.locator('.editor-canvas')).toBeVisible();

    // Add heading section
    await page.dragAndDrop(
      '.section-library-item[data-type="heading"]',
      '.editor-canvas'
    );

    // Edit heading
    await page.dblclick('.section-heading');
    await page.fill('.section-heading input', 'Premium Product');
    await page.press('.section-heading input', 'Enter');

    // Add product highlight
    await page.dragAndDrop(
      '.section-library-item[data-type="product-highlight"]',
      '.editor-canvas'
    );

    // Generate AI content
    await page.click('button:has-text("Generate with AI")');
    await page.fill('input[name="productName"]', 'Premium Headphones');
    await page.click('button:has-text("Generate")');

    // Wait for AI generation
    await expect(page.locator('.ai-loading')).toBeVisible();
    await expect(page.locator('.ai-loading')).not.toBeVisible({ timeout: 15000 });

    // Accept AI content
    await page.click('button:has-text("Accept")');

    // Export HTML
    await page.click('button:has-text("Export HTML")');
    await expect(page.locator('.export-modal')).toBeVisible();

    // Copy to clipboard
    await page.click('button:has-text("Copy to Clipboard")');
    await expect(page.locator('text=Copied!')).toBeVisible();
  });
});
```

---

## 5. Cross-Browser Testing

### 5.1 Browser Matrix

| Browser | Version | Priority |
|---------|---------|----------|
| Chrome | 100+ | P0 |
| Firefox | 100+ | P0 |
| Safari | 15+ | P0 |
| Edge | 100+ | P1 |
| Opera | Latest | P2 |

### 5.2 Testing Checklist

**Per Browser**:
- [ ] Project CRUD operations
- [ ] Drag-and-drop functionality
- [ ] Section editing
- [ ] AI generation
- [ ] HTML export and copy
- [ ] Responsive behavior
- [ ] File uploads

**Tools**:
- BrowserStack or Sauce Labs for automated testing
- Manual testing on local browsers

---

## 6. Responsive Testing

### 6.1 Device Breakpoints

| Device Category | Width | Test Scenarios |
|----------------|-------|----------------|
| Mobile | 375px, 414px | Full user flow |
| Tablet | 768px, 1024px | Full user flow |
| Desktop | 1920px, 2560px | Full user flow |

### 6.2 Responsive Checklist

- [ ] Layout adapts correctly at all breakpoints
- [ ] Touch interactions work on mobile
- [ ] Drag-and-drop works on tablets
- [ ] Text remains readable on small screens
- [ ] Images scale appropriately
- [ ] Modals/panels fit on screen
- [ ] Navigation is accessible on mobile

---

## 7. Performance Testing

### 7.1 Performance Benchmarks

| Metric | Target | Tool |
|--------|--------|------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 3s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse |
| Page Load Time | < 2s | Chrome DevTools |
| API Response Time | < 200ms | Postman |

### 7.2 Load Testing

**Tools**: Apache JMeter, Artillery, or k6

**Scenarios**:
- 10 concurrent users creating projects
- 50 concurrent users browsing templates
- 20 concurrent AI generation requests

**Target**: All operations complete within acceptable time under load

---

## 8. Security Testing

### 8.1 Security Checklist

**Input Validation**:
- [ ] XSS prevention (all user inputs sanitized)
- [ ] SQL injection prevention (parameterized queries)
- [ ] File upload validation (type, size, content)
- [ ] URL validation
- [ ] Color code validation

**Authentication & Authorization** (Future):
- [ ] JWT token security
- [ ] Password hashing (bcrypt)
- [ ] Rate limiting on auth endpoints
- [ ] CSRF protection

**API Security**:
- [ ] Rate limiting on all endpoints
- [ ] OpenAI API key secured (backend only)
- [ ] CORS configured correctly
- [ ] HTTPS enforced (production)

**Data Security**:
- [ ] User data encrypted at rest (future)
- [ ] Sensitive data not logged
- [ ] Database access restricted

**Tools**:
- OWASP ZAP for vulnerability scanning
- npm audit for dependency vulnerabilities
- Snyk for continuous monitoring

---

## 9. Accessibility Testing

### 9.1 WCAG 2.1 AA Compliance

**Manual Testing**:
- [ ] Keyboard navigation (Tab, Enter, Escape, Arrow keys)
- [ ] Screen reader testing (NVDA, JAWS, VoiceOver)
- [ ] Color contrast (4.5:1 for text)
- [ ] Focus indicators visible
- [ ] Alt text on all images
- [ ] ARIA labels on interactive elements

**Automated Testing**:
- [ ] axe DevTools browser extension
- [ ] Lighthouse accessibility audit (score > 90)
- [ ] WAVE accessibility checker

---

## 10. Test Automation Strategy

### 10.1 CI/CD Pipeline

**On Pull Request**:
1. Run linter (ESLint)
2. Run unit tests (frontend + backend)
3. Run integration tests
4. Check code coverage (fail if < 70%)
5. Build frontend and backend

**On Merge to Main**:
1. Run full test suite
2. Run E2E tests
3. Deploy to staging
4. Run smoke tests on staging

**Nightly**:
1. Run full E2E suite
2. Run performance tests
3. Run security scans
4. Generate test reports

### 10.2 GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm ci
      - run: cd frontend && npm run lint
      - run: cd frontend && npm test -- --coverage
      - run: cd frontend && npm run build

  test-backend:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:6.0
        ports:
          - 27017:27017
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm ci
      - run: cd backend && npm test
        env:
          MONGODB_URI: mongodb://localhost:27017/test

  e2e-tests:
    runs-on: ubuntu-latest
    needs: [test-frontend, test-backend]
    if: github.event_name == 'push'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e
```

---

## 11. Test Data Management

### 11.1 Test Fixtures

**Sample Projects**:
```javascript
// fixtures/sampleProject.json
{
  "name": "Sample Wireless Headphones",
  "sections": [
    {
      "id": "fixture-1",
      "type": "heading",
      "config": { "text": "Premium Sound", "tag": "h2" }
    },
    {
      "id": "fixture-2",
      "type": "product-highlight",
      "config": {
        "headline": "Immersive Audio",
        "features": ["ANC", "40hr battery", "Comfort"]
      }
    }
  ],
  "brandColors": ["#3B82F6"]
}
```

**Database Seeding**:
```javascript
// backend/seed.js
import mongoose from 'mongoose';
import Project from './models/Project.js';
import Template from './models/Template.js';
import fixtures from './fixtures/index.js';

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  // Clear existing data
  await Project.deleteMany({});
  await Template.deleteMany({});

  // Insert fixtures
  await Project.insertMany(fixtures.projects);
  await Template.insertMany(fixtures.templates);

  console.log('Database seeded successfully');
  process.exit(0);
}

seed();
```

---

## 12. Bug Tracking & Reporting

### 12.1 Bug Report Template

```markdown
**Title**: [Component] Brief description

**Priority**: Critical / High / Medium / Low

**Environment**:
- OS: Windows 10
- Browser: Chrome 120
- URL: http://localhost:3000/editor/123

**Steps to Reproduce**:
1. Navigate to editor
2. Drag heading section to canvas
3. Click delete button
4. ...

**Expected Result**:
Section should be removed from canvas

**Actual Result**:
Section remains and console shows error

**Screenshots/Videos**:
[Attach if applicable]

**Console Errors**:
```
TypeError: Cannot read property 'id' of undefined
  at deleteSection (editorStore.js:45)
```

**Additional Context**:
Happens only when section is the first item in the list
```

### 12.2 Bug Severity Levels

| Severity | Definition | Example | Response Time |
|----------|------------|---------|---------------|
| **Critical** | Blocks core functionality | Cannot save projects | Immediate |
| **High** | Major feature broken | AI generation fails | < 24 hours |
| **Medium** | Feature partially broken | Preview mode glitchy | < 1 week |
| **Low** | Minor issue | UI misalignment | Backlog |

---

## 13. Test Metrics & Reporting

### 13.1 Key Metrics

- **Code Coverage**: Target > 70%
- **Test Pass Rate**: Target > 95%
- **Defect Density**: Target < 0.5 defects per 1000 LOC
- **Mean Time to Detect (MTTD)**: Target < 1 day
- **Mean Time to Resolve (MTTR)**: Target < 3 days

### 13.2 Test Reports

**Weekly Test Report**:
- Tests run and pass/fail rate
- New bugs discovered
- Bugs fixed
- Code coverage trend
- Performance test results
- Browser compatibility status

---

## 14. Testing Best Practices

### 14.1 General Principles

1. **Write tests first** (TDD approach when possible)
2. **Test behavior, not implementation**
3. **Keep tests simple and focused** (one assertion per test ideal)
4. **Use descriptive test names** (`it('should generate HTML with escaped characters')`)
5. **Mock external dependencies** (AI API, file system)
6. **Clean up after tests** (reset database, clear state)
7. **Make tests deterministic** (no random data, fixed timestamps)
8. **Run tests frequently** (on save, on commit)

### 14.2 Code Review Checklist

- [ ] New features have tests
- [ ] Tests cover edge cases
- [ ] Tests pass locally
- [ ] Code coverage hasn't decreased
- [ ] No console errors in tests
- [ ] Tests are understandable and maintainable

---

**End of Document**
