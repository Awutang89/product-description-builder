# Page Crafter - API Documentation

## Document Information
- **Version**: 1.0
- **Last Updated**: 2025-10-25
- **Base URL**: `http://localhost:5000/api`
- **Status**: Draft

---

## Table of Contents
1. [Overview](#1-overview)
2. [Authentication](#2-authentication)
3. [Error Handling](#3-error-handling)
4. [Rate Limiting](#4-rate-limiting)
5. [Project Endpoints](#5-project-endpoints)
6. [Template Endpoints](#6-template-endpoints)
7. [AI Endpoints](#7-ai-endpoints)
8. [File Upload Endpoints](#8-file-upload-endpoints)
9. [Data Models](#9-data-models)
10. [Code Examples](#10-code-examples)

---

## 1. Overview

### 1.1 API Design Principles
- RESTful architecture
- JSON request/response format
- Consistent error responses
- Stateless requests
- Versioned endpoints (future: `/api/v1/...`)

### 1.2 Base URL
```
Development: http://localhost:5000/api
Production: TBD
```

### 1.3 Request Headers
```http
Content-Type: application/json
Accept: application/json
```

### 1.4 Response Format

**Success Response**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [ ... ]
  }
}
```

---

## 2. Authentication

### 2.1 Authentication Status
**MVP**: No authentication required (local development only)

**Future**: JWT-based authentication
```http
Authorization: Bearer <token>
```

---

## 3. Error Handling

### 3.1 HTTP Status Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource conflict (e.g., duplicate) |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - External service down |

### 3.2 Error Codes

| Error Code | Description |
|------------|-------------|
| `VALIDATION_ERROR` | Request data failed validation |
| `NOT_FOUND` | Requested resource not found |
| `DUPLICATE_ERROR` | Resource already exists |
| `AI_SERVICE_ERROR` | OpenAI API error |
| `FILE_UPLOAD_ERROR` | File upload failed |
| `DATABASE_ERROR` | Database operation failed |
| `RATE_LIMITED` | Too many requests |
| `INTERNAL_ERROR` | Unexpected server error |

### 3.3 Error Response Examples

**Validation Error**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "name",
        "message": "Name is required"
      },
      {
        "field": "brandColors",
        "message": "Invalid color format"
      }
    ]
  }
}
```

**Not Found Error**:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Project not found",
    "details": {
      "projectId": "proj_12345"
    }
  }
}
```

---

## 4. Rate Limiting

### 4.1 Rate Limit Rules

| Endpoint Category | Limit | Window |
|-------------------|-------|--------|
| General API | 100 requests | 15 minutes |
| AI Generation | 50 requests | 1 hour |
| File Upload | 20 requests | 1 hour |

### 4.2 Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1672531200
```

### 4.3 Rate Limit Response

```http
HTTP/1.1 429 Too Many Requests
```
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Please try again later.",
    "details": {
      "retryAfter": 900
    }
  }
}
```

---

## 5. Project Endpoints

### 5.1 Create Project

**Endpoint**: `POST /api/projects`

**Description**: Create a new project

**Request Body**:
```json
{
  "name": "Premium Wireless Headphones",
  "description": "Product page for high-end headphones",
  "sections": [],
  "brandColors": ["#3B82F6", "#1E40AF", "#DBEAFE"],
  "typography": {
    "headingFont": "Inter",
    "bodyFont": "Inter"
  }
}
```

**Request Validation**:
- `name`: Required, string, 1-100 characters
- `description`: Optional, string, max 500 characters
- `sections`: Optional, array of section objects
- `brandColors`: Optional, array of hex color strings
- `typography`: Optional, object with font names

**Success Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Premium Wireless Headphones",
    "description": "Product page for high-end headphones",
    "sections": [],
    "brandColors": ["#3B82F6", "#1E40AF", "#DBEAFE"],
    "typography": {
      "headingFont": "Inter",
      "bodyFont": "Inter"
    },
    "isDraft": true,
    "metadata": {
      "sectionCount": 0
    },
    "createdAt": "2025-10-25T12:00:00.000Z",
    "updatedAt": "2025-10-25T12:00:00.000Z"
  },
  "message": "Project created successfully"
}
```

**Error Responses**:
- 400 Bad Request - Invalid data
- 422 Unprocessable Entity - Validation failed

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Wireless Headphones",
    "description": "Product page for high-end headphones",
    "brandColors": ["#3B82F6"]
  }'
```

---

### 5.2 Get All Projects

**Endpoint**: `GET /api/projects`

**Description**: Retrieve all projects with pagination, filtering, and sorting

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 20 | Items per page (max 100) |
| `sort` | string | `-updatedAt` | Sort field (`createdAt`, `-updatedAt`, `name`) |
| `search` | string | - | Search by name (text search) |
| `isDraft` | boolean | - | Filter by draft status |

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "name": "Premium Wireless Headphones",
        "description": "Product page for high-end headphones",
        "metadata": {
          "sectionCount": 5
        },
        "isDraft": true,
        "createdAt": "2025-10-25T12:00:00.000Z",
        "updatedAt": "2025-10-25T13:30:00.000Z"
      },
      // ... more projects
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 45,
      "itemsPerPage": 20,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

**cURL Example**:
```bash
curl -X GET "http://localhost:5000/api/projects?page=1&limit=20&sort=-updatedAt"
```

---

### 5.3 Get Project by ID

**Endpoint**: `GET /api/projects/:id`

**Description**: Retrieve a specific project by ID

**URL Parameters**:
- `id`: MongoDB ObjectId of the project

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Premium Wireless Headphones",
    "description": "Product page for high-end headphones",
    "sections": [
      {
        "id": "section_1",
        "type": "heading",
        "order": 0,
        "config": {
          "text": "Premium Sound Experience",
          "tag": "h2",
          "fontSize": "3xl",
          "fontWeight": "bold",
          "textAlign": "center",
          "color": "#000000"
        }
      },
      {
        "id": "section_2",
        "type": "product-highlight",
        "order": 1,
        "config": {
          "layout": "image-left",
          "image": {
            "url": "https://example.com/image.jpg",
            "alt": "Product image"
          },
          "headline": "Immersive Audio Quality",
          "description": "Experience crystal-clear sound...",
          "features": [
            "Active Noise Cancellation",
            "40-hour battery life",
            "Premium comfort"
          ],
          "cta": {
            "text": "Shop Now",
            "url": "#",
            "style": "primary"
          }
        }
      }
    ],
    "brandColors": ["#3B82F6", "#1E40AF", "#DBEAFE"],
    "isDraft": true,
    "createdAt": "2025-10-25T12:00:00.000Z",
    "updatedAt": "2025-10-25T13:30:00.000Z"
  }
}
```

**Error Responses**:
- 404 Not Found - Project doesn't exist

**cURL Example**:
```bash
curl -X GET http://localhost:5000/api/projects/64f8a1b2c3d4e5f6a7b8c9d0
```

---

### 5.4 Update Project

**Endpoint**: `PUT /api/projects/:id`

**Description**: Update an existing project

**URL Parameters**:
- `id`: MongoDB ObjectId of the project

**Request Body** (partial update supported):
```json
{
  "name": "Updated Project Name",
  "sections": [
    {
      "id": "section_1",
      "type": "heading",
      "order": 0,
      "config": {
        "text": "New Heading Text"
      }
    }
  ],
  "isDraft": false
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Updated Project Name",
    // ... full updated project
    "updatedAt": "2025-10-25T14:00:00.000Z"
  },
  "message": "Project updated successfully"
}
```

**Error Responses**:
- 400 Bad Request - Invalid data
- 404 Not Found - Project doesn't exist
- 422 Unprocessable Entity - Validation failed

**cURL Example**:
```bash
curl -X PUT http://localhost:5000/api/projects/64f8a1b2c3d4e5f6a7b8c9d0 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Project Name", "isDraft": false}'
```

---

### 5.5 Delete Project

**Endpoint**: `DELETE /api/projects/:id`

**Description**: Delete a project permanently

**URL Parameters**:
- `id`: MongoDB ObjectId of the project

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

**Error Responses**:
- 404 Not Found - Project doesn't exist

**cURL Example**:
```bash
curl -X DELETE http://localhost:5000/api/projects/64f8a1b2c3d4e5f6a7b8c9d0
```

---

### 5.6 Duplicate Project

**Endpoint**: `POST /api/projects/:id/duplicate`

**Description**: Create a copy of an existing project

**URL Parameters**:
- `id`: MongoDB ObjectId of the project to duplicate

**Request Body** (optional):
```json
{
  "name": "Copy of Original Project"
}
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "name": "Copy of Original Project",
    // ... all fields from original project
    "createdAt": "2025-10-25T15:00:00.000Z"
  },
  "message": "Project duplicated successfully"
}
```

**Error Responses**:
- 404 Not Found - Original project doesn't exist

---

### 5.7 Export Project to HTML

**Endpoint**: `POST /api/projects/:id/export`

**Description**: Generate Shopify-compatible HTML from project

**URL Parameters**:
- `id`: MongoDB ObjectId of the project

**Request Body** (optional):
```json
{
  "options": {
    "includeStyles": true,
    "responsive": true,
    "minify": false
  }
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "html": "<style>\n/* Page Crafter Styles */\n.pc-heading {...}\n</style>\n\n<div class=\"page-crafter-content\">...</div>",
    "stats": {
      "sectionCount": 5,
      "htmlSize": 12345,
      "cssSize": 3456,
      "generatedAt": "2025-10-25T15:30:00.000Z"
    }
  },
  "message": "HTML exported successfully"
}
```

**Error Responses**:
- 404 Not Found - Project doesn't exist
- 500 Internal Server Error - Export failed

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/projects/64f8a1b2c3d4e5f6a7b8c9d0/export \
  -H "Content-Type: application/json" \
  -d '{"options": {"minify": true}}'
```

---

## 6. Template Endpoints

### 6.1 Create Template

**Endpoint**: `POST /api/templates`

**Description**: Save a project as a reusable template

**Request Body**:
```json
{
  "name": "Tech Product Template",
  "description": "Modern template for tech products with features and specs",
  "category": "tech",
  "sections": [
    // ... section data
  ],
  "brandColors": ["#3B82F6"],
  "tags": ["tech", "modern", "minimal"]
}
```

**Request Validation**:
- `name`: Required, string, 1-100 characters
- `description`: Required, string, 1-500 characters
- `category`: Required, enum: `tech`, `fashion`, `home`, `beauty`, `sports`, `general`
- `sections`: Required, array of section objects
- `tags`: Optional, array of strings

**Success Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "name": "Tech Product Template",
    "description": "Modern template for tech products...",
    "thumbnail": "",
    "category": "tech",
    "sections": [ ... ],
    "brandColors": ["#3B82F6"],
    "isPrebuilt": false,
    "isFeatured": false,
    "usageCount": 0,
    "tags": ["tech", "modern", "minimal"],
    "createdAt": "2025-10-25T16:00:00.000Z"
  },
  "message": "Template created successfully"
}
```

---

### 6.2 Get All Templates

**Endpoint**: `GET /api/templates`

**Description**: Retrieve all templates with filtering and pagination

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 20 | Items per page |
| `category` | string | - | Filter by category |
| `isPrebuilt` | boolean | - | Filter by prebuilt status |
| `isFeatured` | boolean | - | Filter by featured status |
| `search` | string | - | Search by name/description |
| `sort` | string | `-usageCount` | Sort field |

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "name": "Tech Product Template",
        "description": "Modern template for tech products...",
        "thumbnail": "https://example.com/thumb.jpg",
        "category": "tech",
        "isPrebuilt": true,
        "isFeatured": true,
        "usageCount": 145,
        "tags": ["tech", "modern"],
        "createdAt": "2025-10-25T16:00:00.000Z"
      },
      // ... more templates
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 35,
      "itemsPerPage": 20
    }
  }
}
```

---

### 6.3 Get Template by ID

**Endpoint**: `GET /api/templates/:id`

**Description**: Retrieve a specific template with full section data

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "name": "Tech Product Template",
    "description": "Modern template for tech products...",
    "sections": [
      // ... full section data
    ],
    "brandColors": ["#3B82F6"],
    "usageCount": 145,
    "createdAt": "2025-10-25T16:00:00.000Z"
  }
}
```

---

### 6.4 Use Template

**Endpoint**: `POST /api/templates/:id/use`

**Description**: Increment template usage count (analytics)

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Template usage recorded"
}
```

---

### 6.5 Update Template

**Endpoint**: `PUT /api/templates/:id`

**Description**: Update template metadata or content

**Request Body**:
```json
{
  "name": "Updated Template Name",
  "description": "Updated description",
  "isFeatured": true
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    // ... updated template
  },
  "message": "Template updated successfully"
}
```

---

### 6.6 Delete Template

**Endpoint**: `DELETE /api/templates/:id`

**Description**: Delete a template (only non-prebuilt)

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Template deleted successfully"
}
```

**Error Responses**:
- 403 Forbidden - Cannot delete prebuilt template

---

## 7. AI Endpoints

### 7.1 Generate Section Content

**Endpoint**: `POST /api/ai/generate-section`

**Description**: Generate content for a specific section using AI

**Request Body**:
```json
{
  "sectionType": "product-highlight",
  "productInfo": {
    "name": "ProMax Wireless Headphones",
    "features": [
      "Active Noise Cancellation",
      "40-hour battery life",
      "Premium comfort padding"
    ],
    "specifications": {
      "weight": "250g",
      "connectivity": "Bluetooth 5.0"
    },
    "targetAudience": "professionals and audiophiles",
    "category": "Electronics"
  },
  "options": {
    "tone": "professional",
    "length": "medium"
  }
}
```

**Request Validation**:
- `sectionType`: Required, valid section type
- `productInfo`: Required, object with product details
- `productInfo.name`: Required, string
- `options.tone`: Optional, enum: `professional`, `casual`, `enthusiastic`
- `options.length`: Optional, enum: `short`, `medium`, `long`

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "content": {
      "headline": "ProMax Wireless Headphones: Your Sound Sanctuary",
      "description": "Experience audio perfection with industry-leading Active Noise Cancellation, premium comfort, and an astounding 40-hour battery life. Designed for professionals and audiophiles who demand the best.",
      "features": [
        "Industry-leading Active Noise Cancellation blocks out distractions",
        "40-hour battery life keeps you connected all day and night",
        "Premium comfort padding for extended listening sessions"
      ],
      "cta": "Experience Premium Audio"
    },
    "metadata": {
      "tokensUsed": 245,
      "model": "gpt-4",
      "generatedAt": "2025-10-25T17:00:00.000Z"
    }
  },
  "message": "Content generated successfully"
}
```

**Error Responses**:
- 400 Bad Request - Invalid section type or missing required fields
- 429 Too Many Requests - AI rate limit exceeded
- 503 Service Unavailable - OpenAI API error

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/ai/generate-section \
  -H "Content-Type: application/json" \
  -d '{
    "sectionType": "product-highlight",
    "productInfo": {
      "name": "ProMax Wireless Headphones",
      "features": ["Active Noise Cancellation", "40hr battery"],
      "targetAudience": "professionals"
    },
    "options": {"tone": "professional"}
  }'
```

---

### 7.2 Generate Full Page

**Endpoint**: `POST /api/ai/generate-page`

**Description**: Generate a complete product page with multiple sections

**Request Body**:
```json
{
  "productInfo": {
    "name": "ProMax Wireless Headphones",
    "category": "Electronics",
    "features": [
      "Active Noise Cancellation",
      "40-hour battery life",
      "Premium comfort",
      "Bluetooth 5.0"
    ],
    "specifications": {
      "weight": "250g",
      "driver": "40mm",
      "frequency": "20Hz - 20kHz",
      "connectivity": "Bluetooth 5.0",
      "batteryLife": "40 hours"
    },
    "targetAudience": "professionals and audiophiles",
    "usp": "Best-in-class noise cancellation with premium comfort",
    "priceRange": "premium"
  },
  "options": {
    "tone": "professional",
    "includeSections": ["hero", "features", "specs", "proscons"]
  }
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "sections": [
      {
        "type": "product-highlight",
        "content": {
          "headline": "ProMax Wireless Headphones",
          "description": "...",
          "features": [...]
        }
      },
      {
        "type": "heading",
        "content": {
          "text": "Key Features"
        }
      },
      {
        "type": "three-columns",
        "content": {
          "columns": [
            {
              "title": "Active Noise Cancellation",
              "description": "..."
            },
            // ... more columns
          ]
        }
      },
      {
        "type": "specification",
        "content": {
          "title": "Technical Specifications",
          "specs": [
            {"label": "Weight", "value": "250g"},
            {"label": "Driver Size", "value": "40mm"},
            // ... more specs
          ]
        }
      },
      {
        "type": "pros-cons",
        "content": {
          "pros": [...],
          "cons": [...]
        }
      }
    ],
    "metadata": {
      "tokensUsed": 1250,
      "model": "gpt-4",
      "generatedAt": "2025-10-25T17:15:00.000Z"
    }
  },
  "message": "Page generated successfully"
}
```

**Error Responses**:
- 400 Bad Request - Missing required product information
- 429 Too Many Requests - AI rate limit exceeded
- 503 Service Unavailable - OpenAI API error

---

### 7.3 Refine Content

**Endpoint**: `POST /api/ai/refine`

**Description**: Refine or improve existing content

**Request Body**:
```json
{
  "originalContent": "This is a basic product description that needs improvement.",
  "instructions": "Make it more compelling and add emotional appeal",
  "sectionType": "paragraph",
  "tone": "enthusiastic"
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "refinedContent": "Discover the transformative power of our revolutionary product...",
    "metadata": {
      "tokensUsed": 180,
      "generatedAt": "2025-10-25T17:20:00.000Z"
    }
  }
}
```

---

## 8. File Upload Endpoints

### 8.1 Upload Image

**Endpoint**: `POST /api/upload/image`

**Description**: Upload product image

**Request**:
- Content-Type: `multipart/form-data`
- Field name: `image`
- Accepted formats: JPG, PNG, WebP
- Max size: 5MB

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "url": "http://localhost:5000/uploads/images/abc123.jpg",
    "filename": "abc123.jpg",
    "size": 245678,
    "mimeType": "image/jpeg"
  },
  "message": "Image uploaded successfully"
}
```

**Error Responses**:
- 400 Bad Request - No file provided
- 413 Payload Too Large - File exceeds 5MB
- 415 Unsupported Media Type - Invalid file type

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/upload/image \
  -F "image=@/path/to/image.jpg"
```

---

## 9. Data Models

### 9.1 Project Model

```typescript
interface Project {
  id: string;                    // MongoDB ObjectId
  name: string;                  // 1-100 characters
  description?: string;          // Max 500 characters
  sections: Section[];
  brandColors: string[];         // Hex color codes
  typography?: {
    headingFont?: string;
    bodyFont?: string;
  };
  isDraft: boolean;              // Default: true
  lastExportedAt?: Date;
  metadata: {
    sectionCount: number;
    estimatedRenderTime?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### 9.2 Section Model

```typescript
interface Section {
  id: string;                    // Unique ID (UUID)
  type: string;                  // Section type
  order: number;                 // Display order
  config: Record<string, any>;   // Section-specific configuration
  content?: Record<string, any>; // Section content
  styles?: Record<string, any>;  // Custom styles
}
```

### 9.3 Template Model

```typescript
interface Template {
  id: string;                    // MongoDB ObjectId
  name: string;                  // 1-100 characters
  description: string;           // 1-500 characters
  thumbnail?: string;            // URL to thumbnail image
  category: 'tech' | 'fashion' | 'home' | 'beauty' | 'sports' | 'general';
  sections: Section[];
  brandColors: string[];
  isPrebuilt: boolean;           // Default: false
  isFeatured: boolean;           // Default: false
  usageCount: number;            // Default: 0
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 10. Code Examples

### 10.1 JavaScript (Axios)

**Create Project**:
```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const createProject = async (projectData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/projects`, projectData);
    console.log('Project created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error.response.data);
    throw error;
  }
};

// Usage
createProject({
  name: 'My New Project',
  brandColors: ['#3B82F6'],
  sections: []
});
```

**Generate AI Content**:
```javascript
const generateContent = async (sectionType, productInfo) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ai/generate-section`, {
      sectionType,
      productInfo,
      options: { tone: 'professional' }
    });
    console.log('Generated content:', response.data.data.content);
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded. Please try again later.');
    } else {
      console.error('Error generating content:', error.response.data);
    }
    throw error;
  }
};

// Usage
generateContent('product-highlight', {
  name: 'ProMax Headphones',
  features: ['Noise Cancellation', '40hr battery'],
  targetAudience: 'professionals'
});
```

### 10.2 React Hook Example

```javascript
// useProjects.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/projects`);
      setProjects(response.data.data.projects);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/projects`, projectData);
      setProjects([...projects, response.data.data]);
      return response.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.error?.message || 'Failed to create project');
    }
  };

  const deleteProject = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/projects/${id}`);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.error?.message || 'Failed to delete project');
    }
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    deleteProject
  };
};
```

### 10.3 API Service Class

```javascript
// apiService.js
import axios from 'axios';

class APIService {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        const message = error.response?.data?.error?.message || 'An error occurred';
        return Promise.reject(new Error(message));
      }
    );
  }

  // Project methods
  async getProjects(params = {}) {
    const response = await this.client.get('/projects', { params });
    return response.data.data;
  }

  async getProject(id) {
    const response = await this.client.get(`/projects/${id}`);
    return response.data.data;
  }

  async createProject(data) {
    const response = await this.client.post('/projects', data);
    return response.data.data;
  }

  async updateProject(id, data) {
    const response = await this.client.put(`/projects/${id}`, data);
    return response.data.data;
  }

  async deleteProject(id) {
    await this.client.delete(`/projects/${id}`);
  }

  async exportProject(id, options = {}) {
    const response = await this.client.post(`/projects/${id}/export`, { options });
    return response.data.data;
  }

  // Template methods
  async getTemplates(params = {}) {
    const response = await this.client.get('/templates', { params });
    return response.data.data;
  }

  async getTemplate(id) {
    const response = await this.client.get(`/templates/${id}`);
    return response.data.data;
  }

  // AI methods
  async generateSectionContent(sectionType, productInfo, options = {}) {
    const response = await this.client.post('/ai/generate-section', {
      sectionType,
      productInfo,
      options
    });
    return response.data.data;
  }

  async generateFullPage(productInfo, options = {}) {
    const response = await this.client.post('/ai/generate-page', {
      productInfo,
      options
    });
    return response.data.data;
  }

  // File upload
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await this.client.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  }
}

// Export singleton instance
export default new APIService('http://localhost:5000/api');
```

**Usage**:
```javascript
import api from './apiService';

// Fetch projects
const projects = await api.getProjects({ page: 1, limit: 20 });

// Create project
const newProject = await api.createProject({
  name: 'My Project',
  sections: []
});

// Generate AI content
const content = await api.generateSectionContent('product-highlight', {
  name: 'Product Name',
  features: ['Feature 1', 'Feature 2']
});
```

---

## 11. Postman Collection

### 11.1 Import Instructions

1. Download Postman: https://www.postman.com/downloads/
2. Create new collection: "Page Crafter API"
3. Set base URL variable: `{{baseURL}}` = `http://localhost:5000/api`
4. Import the following requests

### 11.2 Sample Requests

**Collection Structure**:
```
Page Crafter API/
├── Projects/
│   ├── Create Project (POST)
│   ├── Get All Projects (GET)
│   ├── Get Project by ID (GET)
│   ├── Update Project (PUT)
│   ├── Delete Project (DELETE)
│   ├── Duplicate Project (POST)
│   └── Export Project (POST)
├── Templates/
│   ├── Create Template (POST)
│   ├── Get All Templates (GET)
│   ├── Get Template by ID (GET)
│   └── Use Template (POST)
├── AI/
│   ├── Generate Section (POST)
│   ├── Generate Page (POST)
│   └── Refine Content (POST)
└── Upload/
    └── Upload Image (POST)
```

---

## 12. Changelog

### Version 1.0 (2025-10-25)
- Initial API documentation
- Project CRUD endpoints
- Template endpoints
- AI generation endpoints
- File upload endpoints

---

**End of Document**
