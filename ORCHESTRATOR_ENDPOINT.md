# Orchestrator Endpoint Documentation

## Overview
The orchestrator endpoint generates a complete product page (2-8 sections) by running the 5-stage workflow internally and intelligently mapping content to Canvas sections.

## Endpoint
```
POST /api/ai/generate-full-page
```

## Request Body

```json
{
  "productTitle": "HealthMate Plus Air Purifier",
  "supplierDescription": "Advanced HEPA filtration system with 360-degree air intake, removes 99.97% of airborne particles, covers up to 1500 sq ft, includes carbon filter for odors, quiet operation at 50dB, Energy Star certified.",
  "secondaryKeywords": [
    "HealthMate Plus Air",
    "Austin Air Purifier",
    "HealthMate Plus Purifier",
    "Austin Air HealthMate"
  ],
  "mediaInventory": {
    "images": [
      "https://example.com/product-main.jpg",
      "https://example.com/product-side.jpg",
      "https://example.com/product-filter.jpg"
    ]
  },
  "userProvidedContent": {
    "reviewImage": "https://example.com/customer-review.jpg",
    "installationManual": [
      "https://example.com/manual-step1.jpg",
      "https://example.com/manual-step2.jpg"
    ],
    "videoUrl": "https://youtube.com/watch?v=example"
  }
}
```

### Required Fields
- `productTitle` (string): Main product keyword/title
- `supplierDescription` (string): Product description from supplier

### Optional Fields
- `secondaryKeywords` (array): SEO keyword variations (recommended 4-6 keywords)
- `mediaInventory` (object):
  - `images` (array): Product images (recommended 3-6 images)
- `userProvidedContent` (object):
  - `reviewImage` (string): Customer review image URL
  - `installationManual` (array): Installation guide image URLs
  - `videoUrl` (string): YouTube video URL

## Response

```json
{
  "success": true,
  "data": {
    "sections": [
      {
        "type": "twoColumn",
        "content": {
          "leftText": "<h2>How the HealthMate Plus Air Purifier Cleans Your Air</h2><p>...</p>",
          "rightImage": "https://example.com/product-main.jpg",
          "imageAlt": "HealthMate Plus Air - Product overview and key features"
        },
        "config": {
          "imagePosition": "right"
        },
        "styles": {
          "padding": "lg",
          "marginBottom": "md"
        }
      },
      {
        "type": "features",
        "content": {
          "heading": "Key Features of HealthMate Plus Air",
          "features": [
            {
              "title": "360° Perforated Steel Intake",
              "description": "Drawing air into all sides of the purifier...",
              "icon": null
            }
          ]
        }
      },
      {
        "type": "text",
        "content": {
          "text": "<h2>Another Problem Solved</h2><p>...</p><p>Get your HealthMate Plus Air Purifier today...</p>"
        }
      }
    ],
    "sectionCount": 3,
    "validations": [
      {
        "sectionIndex": 0,
        "valid": true,
        "issues": []
      }
    ],
    "allValid": true,
    "usage": {
      "promptTokens": 2500,
      "completionTokens": 1800,
      "totalTokens": 4300
    }
  },
  "message": "Successfully generated 3 sections"
}
```

## How It Works

### Phase 1: Content Generation (5-Stage Guidelines)
1. **Stage 1**: Identifies 2-4 problems the product solves
2. **Stage 2**: Generates solution explanations for each problem
3. **Stage 3**: Maps features to customer benefits
4. **Stage 4**: Extracts and explains technical specifications
5. **Stage 5**: Creates conclusion content with soft CTA

### Phase 2: Smart Section Assembly
The orchestrator intelligently distributes content across 2-8 sections:

#### Problem-Solution Sections (2-4 sections):
- **Section 1**: Always `twoColumn` (Problem 1 + Solution + Image)
- **Section 2**: `features` list (Problem 2 via feature-benefits) OR `twoColumn` if features unavailable
- **Section 3+**: `text` or `twoColumn` (Additional problems + solutions)
- **Last Problem Section**: Gets soft CTA appended

#### Supporting Sections (0-4 sections):
- Spec table (`comparison` type) if technical specs available
- Review image (`image` type) if provided by user
- Installation manual (`gallery` type) if provided
- YouTube video (`video` type) if provided

### Section Order Example (6 sections):
1. `twoColumn` - Problem 1 + Solution + image
2. `features` - Problem 2 through feature-benefits
3. `comparison` - Spec table
4. `text` - Problem 3 + Solution + **soft CTA**
5. `image` - Customer review photo
6. `gallery` - Installation manual images

## Section Types Generated

### Problem-Solution Sections
- **twoColumn**: Problem + solution with image on right
- **features**: Feature list with benefit descriptions
- **text**: Rich text content (HTML with `<h2>` and `<p>` tags)

### Supporting Sections
- **comparison**: Spec table with headers and rows
- **image**: Single image with alt text
- **gallery**: Multiple images with captions
- **video**: YouTube video embed

## Field Mapping Rules

### twoColumn
- `leftText`: HTML content (includes `<h2>` heading with keyword)
- `rightImage`: Image URL
- `imageAlt`: Keyword-rich alt text (format: "{keyword} - {description}")

### features
- `heading`: Section heading with keyword
- `features[]`: Array of {title, description, icon}

### text
- `text`: HTML content with `<h2>` and `<p>` tags
- Last problem section includes soft CTA

### comparison
- `heading`: Table heading
- `table.headers[]`: Array of column headers
- `table.rows[][]`: 2D array of table data

### image
- `url`: Image URL
- `altText`: Keyword-rich alt text

### gallery
- `heading`: Gallery heading with keyword
- `description`: Gallery description
- `images[]`: Array of {url, alt}

### video
- `videoUrl`: YouTube URL
- `heading`: Video heading with keyword
- `description`: Video description

## Alt Text Format
All images use keyword-rich alt text:
```
"{secondary_keyword} - {descriptive text}"
```

Examples:
- "HealthMate Plus Air Purifier - HEPA filtration system in home setting"
- "Austin Air Purifier - 360-degree air intake design closeup"

## Error Handling

### Validation Errors (400)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Product title is required"
  }
}
```

### Generation Errors (500)
```json
{
  "success": false,
  "error": {
    "code": "ORCHESTRATOR_ERROR",
    "message": "Failed to generate full page content"
  }
}
```

## Usage Notes

1. **Secondary Keywords**: Strongly recommended for SEO. Generate using `/api/ai/keywords` endpoint first.

2. **Media Inventory**: More images = more visual sections. Recommend 3-6 product images.

3. **Section Count**: Always 2-8 sections. Fewer problems + less media = fewer sections.

4. **Soft CTA**: Automatically added to last problem-solution section. No separate CTA button section needed.

5. **Token Usage**: Typical page generation uses 3000-5000 tokens (~2-4 stages × 800-1200 tokens each).

6. **Processing Time**: Expect 10-20 seconds for complete generation (5 sequential AI calls).

## Example Request

```bash
curl -X POST http://localhost:5000/api/ai/generate-full-page \
  -H "Content-Type: application/json" \
  -d '{
    "productTitle": "Duramax SideMate Shed with Foundation 4x8",
    "supplierDescription": "Durable vinyl shed with metal reinforcement, 4ft x 8ft size, includes foundation kit, weather-resistant, easy assembly, 5-year warranty, perfect for tool storage and garden equipment.",
    "secondaryKeywords": [
      "Sidemate Shed",
      "Duramax Shed",
      "Sidemate Backyard Shed",
      "4x8 Duramax Shed"
    ],
    "mediaInventory": {
      "images": [
        "https://example.com/shed-front.jpg",
        "https://example.com/shed-open.jpg",
        "https://example.com/shed-interior.jpg"
      ]
    }
  }'
```

## Integration with Section Builder Modal

Replace the old multi-step workflow with a single call:

```javascript
// OLD: Multiple API calls
// 1. POST /api/ai/agentic/stage1-problem
// 2. POST /api/ai/agentic/stage2-solution
// ... (5 separate calls)
// 6. POST /api/ai/agentic/map-content

// NEW: Single API call
const response = await fetch('/api/ai/generate-full-page', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productTitle,
    supplierDescription,
    secondaryKeywords,
    mediaInventory,
    userProvidedContent
  })
});

const { data } = await response.json();
// data.sections is ready to add to Canvas
```
