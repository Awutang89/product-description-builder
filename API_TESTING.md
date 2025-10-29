# Page Crafter API - Testing Guide

## 🚀 Quick Start Testing

### Prerequisites
1. **MongoDB** running locally or via Atlas
2. **Backend** running on `http://localhost:5000`
3. **Frontend** running on `http://localhost:3000`

### Getting Started

**Terminal 1 - Backend**:
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

**Terminal 2 - Frontend** (optional for testing):
```bash
cd frontend
npm run dev
```

---

## 📝 API Testing with cURL

### 1. Health Check
Test that the server is running:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-25T..."
}
```

---

## 📚 PROJECT ENDPOINTS

### Create a Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Wireless Headphones",
    "description": "A product page for high-end headphones",
    "brandColors": ["#3B82F6", "#1E40AF"],
    "sections": []
  }'
```

**Success Response (201)**:
```json
{
  "success": true,
  "data": {
    "_id": "6755a1b2c3d4e5f6a7b8c9d0",
    "name": "Premium Wireless Headphones",
    "description": "A product page for high-end headphones",
    "sections": [],
    "brandColors": ["#3B82F6", "#1E40AF"],
    "isDraft": true,
    "metadata": {
      "sectionCount": 0
    },
    "createdAt": "2025-10-25T...",
    "updatedAt": "2025-10-25T..."
  },
  "message": "Project created successfully"
}
```

---

### Get All Projects
```bash
curl http://localhost:5000/api/projects
```

**Query Parameters**:
```bash
# With pagination
curl "http://localhost:5000/api/projects?page=1&limit=10"

# With search
curl "http://localhost:5000/api/projects?search=wireless"

# Filter by draft status
curl "http://localhost:5000/api/projects?isDraft=true"

# With custom sort
curl "http://localhost:5000/api/projects?sort=-createdAt"
```

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "_id": "6755a1b2c3d4e5f6a7b8c9d0",
        "name": "Premium Wireless Headphones",
        ...
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 1,
      "itemsPerPage": 20,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

---

### Get a Single Project
```bash
# Replace PROJECT_ID with actual ID
curl http://localhost:5000/api/projects/6755a1b2c3d4e5f6a7b8c9d0
```

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "_id": "6755a1b2c3d4e5f6a7b8c9d0",
    "name": "Premium Wireless Headphones",
    "sections": [],
    "brandColors": ["#3B82F6"],
    ...
  }
}
```

---

### Update a Project
```bash
curl -X PUT http://localhost:5000/api/projects/6755a1b2c3d4e5f6a7b8c9d0 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Project Name",
    "isDraft": false
  }'
```

---

### Delete a Project
```bash
curl -X DELETE http://localhost:5000/api/projects/6755a1b2c3d4e5f6a7b8c9d0
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

### Duplicate a Project
```bash
curl -X POST http://localhost:5000/api/projects/6755a1b2c3d4e5f6a7b8c9d0/duplicate \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Wireless Headphones - Copy"
  }'
```

---

## 📚 TEMPLATE ENDPOINTS

### Create a Template
```bash
curl -X POST http://localhost:5000/api/templates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Product Template",
    "description": "Modern template for tech products",
    "category": "tech",
    "sections": [],
    "brandColors": ["#3B82F6"],
    "tags": ["tech", "modern", "minimal"]
  }'
```

---

### Get All Templates
```bash
curl http://localhost:5000/api/templates
```

**Query Parameters**:
```bash
# By category
curl "http://localhost:5000/api/templates?category=tech"

# Prebuilt only
curl "http://localhost:5000/api/templates?isPrebuilt=true"

# Featured only
curl "http://localhost:5000/api/templates?isFeatured=true"

# Search
curl "http://localhost:5000/api/templates?search=tech"

# Combined
curl "http://localhost:5000/api/templates?category=tech&isFeatured=true&page=1&limit=10"
```

---

### Get Featured Templates
```bash
curl http://localhost:5000/api/templates/featured
```

---

### Get Templates by Category
```bash
curl http://localhost:5000/api/templates/category/tech
```

---

### Use a Template (Record Usage)
```bash
curl -X POST http://localhost:5000/api/templates/6755a1b2c3d4e5f6a7b8c9d0/use
```

---

### Update a Template
```bash
curl -X PUT http://localhost:5000/api/templates/6755a1b2c3d4e5f6a7b8c9d0 \
  -H "Content-Type: application/json" \
  -d '{
    "isFeatured": true,
    "category": "tech"
  }'
```

---

### Delete a Template
```bash
curl -X DELETE http://localhost:5000/api/templates/6755a1b2c3d4e5f6a7b8c9d0
```

---

## 🧪 Complete Testing Workflow

### Step 1: Create a Project
```bash
# Save the project ID from the response
PROJ_ID=$(curl -s -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "Test description",
    "brandColors": ["#3B82F6"]
  }' | jq -r '.data._id')

echo "Created project: $PROJ_ID"
```

### Step 2: Retrieve the Project
```bash
curl http://localhost:5000/api/projects/$PROJ_ID
```

### Step 3: Update the Project
```bash
curl -X PUT http://localhost:5000/api/projects/$PROJ_ID \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Product"
  }'
```

### Step 4: Create a Template from Project
```bash
# Save project as template
curl -X POST http://localhost:5000/api/templates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Template",
    "description": "Template from test project",
    "category": "general",
    "sections": [],
    "brandColors": ["#3B82F6"]
  }'
```

### Step 5: Duplicate the Project
```bash
curl -X POST http://localhost:5000/api/projects/$PROJ_ID/duplicate \
  -H "Content-Type: application/json" \
  -d '{"name": "Duplicate Project"}'
```

### Step 6: Clean Up (Delete)
```bash
curl -X DELETE http://localhost:5000/api/projects/$PROJ_ID
```

---

## 🔍 Common Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid project data",
    "details": [
      {
        "field": "name",
        "message": "Project name is required"
      }
    ]
  }
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Project not found",
    "details": {
      "projectId": "invalid_id"
    }
  }
}
```

### Database Error (500)
```json
{
  "success": false,
  "error": {
    "code": "DATABASE_ERROR",
    "message": "Failed to create project"
  }
}
```

---

## 💡 Testing with Postman

1. **Import Collection**
   - Create new collection: "Page Crafter API"
   - Add these requests with examples above

2. **Set Variables**
   ```
   {{baseURL}} = http://localhost:5000/api
   {{projectId}} = (save from first request)
   {{templateId}} = (save from template creation)
   ```

3. **Test Workflow**
   - Create Project → Copy ID
   - Get Project using ID
   - Update Project
   - Duplicate Project
   - Delete Project

---

## 📊 Testing Checklist

- [ ] Backend server starts without errors
- [ ] MongoDB connection established
- [ ] Health check endpoint works
- [ ] Create project returns 201
- [ ] Get all projects returns 200
- [ ] Get single project returns 200
- [ ] Update project returns 200
- [ ] Delete project returns 200
- [ ] Duplicate project creates new copy
- [ ] Create template returns 201
- [ ] Get templates with filters works
- [ ] Use template increments usage count
- [ ] Error responses are properly formatted
- [ ] Pagination works correctly
- [ ] Search functionality works

---

## 🚀 Performance Testing

### Load Test Projects
```bash
# Create 10 projects
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/projects \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"Project $i\", \"brandColors\": [\"#3B82F6\"]}"
  sleep 0.1
done
```

### Query Performance
Test pagination with various limits:
```bash
curl "http://localhost:5000/api/projects?page=1&limit=50"
```

---

## 🐛 Debugging Tips

1. **Check MongoDB Connection**
   ```bash
   # In MongoDB shell
   show dbs
   use page-crafter
   db.projects.find()
   ```

2. **View Server Logs**
   - Look at terminal where `npm run dev` is running
   - Should show Morgan HTTP logs

3. **Test JSON Format**
   ```bash
   # Use jq for pretty JSON output
   curl http://localhost:5000/api/projects | jq
   ```

4. **Check Content-Type Header**
   ```bash
   # Ensure application/json
   curl -H "Content-Type: application/json" ...
   ```

---

## 📱 Frontend Testing

### Test API Service in Browser Console
```javascript
// Import the service (in browser console after frontend loads)
import projectService from './services/projectService.js';

// Create a project
projectService.createProject({
  name: "Test from Console",
  brandColors: ["#3B82F6"]
}).then(result => console.log(result));

// Get all projects
projectService.getAllProjects().then(result => console.log(result));
```

---

**Next Steps**: Once all tests pass, proceed to Phase 2: Frontend Editor Interface

