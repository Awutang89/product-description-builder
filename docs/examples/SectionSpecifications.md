# Page Crafter - Section Component Specifications

## Document Information
- **Version**: 1.0
- **Last Updated**: 2025-10-25
- **Purpose**: Detailed specifications for all section components

---

## Table of Contents
1. [Section Architecture](#1-section-architecture)
2. [Basic Sections](#2-basic-sections)
3. [Product Sections](#3-product-sections)
4. [Column Sections](#4-column-sections)
5. [Media Sections](#5-media-sections)
6. [Advanced Sections](#6-advanced-sections)

---

## 1. Section Architecture

### 1.1 Section Schema

All sections follow this base schema:

```typescript
interface Section {
  id: string;                    // Unique identifier (UUID)
  type: SectionType;             // Section type identifier
  order: number;                 // Display order
  config: SectionConfig;         // Section-specific configuration
  content?: Record<string, any>; // Optional content data
  styles?: Record<string, any>;  // Custom CSS overrides
}

type SectionType =
  | 'heading' | 'paragraph' | 'media' | 'button' | 'spacer' | 'divider'
  | 'product-highlight' | 'pros-cons' | 'specification' | 'features'
  | 'two-column' | 'three-column'
  | 'gallery' | 'two-images' | 'three-images'
  | 'accordion' | 'rating';
```

### 1.2 Component Pattern

```javascript
// Base pattern for all section components
const SectionComponent = ({ sectionId, config, isPreview }) => {
  const { updateConfig } = useSectionConfig(sectionId);

  const handleChange = (key, value) => {
    updateConfig({ [key]: value });
  };

  return isPreview ? (
    <PreviewView config={config} />
  ) : (
    <EditView config={config} onChange={handleChange} />
  );
};

SectionComponent.defaultConfig = { /* defaults */ };
SectionComponent.schema = { /* field definitions */ };

export default SectionComponent;
```

---

## 2. Basic Sections

### 2.1 Heading Section

**Type**: `heading`
**Category**: Basic
**Icon**: Type
**Description**: Add customizable headings (H1-H6) with styling options

#### Configuration Schema

```javascript
{
  type: 'heading',
  defaultConfig: {
    text: 'Your Heading Here',
    tag: 'h2',              // h1, h2, h3, h4, h5, h6
    fontSize: '2xl',        // sm, base, lg, xl, 2xl, 3xl, 4xl
    fontWeight: 'bold',     // normal, medium, semibold, bold
    textAlign: 'left',      // left, center, right
    color: '#000000',       // Hex color
    marginTop: 16,          // pixels
    marginBottom: 8,        // pixels
  },
  editableFields: [
    { key: 'text', type: 'text', label: 'Text', placeholder: 'Enter heading' },
    { key: 'tag', type: 'select', label: 'Level', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
    { key: 'fontSize', type: 'select', label: 'Size', options: ['sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'] },
    { key: 'fontWeight', type: 'select', label: 'Weight', options: ['normal', 'medium', 'semibold', 'bold'] },
    { key: 'textAlign', type: 'radio', label: 'Alignment', options: ['left', 'center', 'right'] },
    { key: 'color', type: 'color', label: 'Text Color' },
    { key: 'marginTop', type: 'slider', label: 'Margin Top', min: 0, max: 64, unit: 'px' },
    { key: 'marginBottom', type: 'slider', label: 'Margin Bottom', min: 0, max: 64, unit: 'px' },
  ]
}
```

#### HTML Export Example

```html
<h2 class="pc-heading pc-heading-abc123" style="color: #000000;">
  Your Heading Here
</h2>
```

#### CSS Export

```css
.pc-heading-abc123 {
  font-size: 24px;
  font-weight: 700;
  text-align: left;
  margin-top: 16px;
  margin-bottom: 8px;
  line-height: 1.2;
}
```

---

### 2.2 Paragraph Section

**Type**: `paragraph`
**Category**: Basic
**Icon**: AlignLeft
**Description**: Rich text paragraph with formatting options

#### Configuration Schema

```javascript
{
  type: 'paragraph',
  defaultConfig: {
    text: 'Your paragraph text here. You can format it with **bold**, *italic*, and more.',
    fontSize: 'base',       // sm, base, lg
    textAlign: 'left',      // left, center, right, justify
    color: '#333333',
    lineHeight: 1.6,        // 1.2, 1.4, 1.6, 1.8, 2.0
    marginBottom: 16,
  },
  editableFields: [
    { key: 'text', type: 'richtext', label: 'Content' },
    { key: 'fontSize', type: 'select', label: 'Size', options: ['sm', 'base', 'lg'] },
    { key: 'textAlign', type: 'radio', label: 'Alignment', options: ['left', 'center', 'right', 'justify'] },
    { key: 'color', type: 'color', label: 'Text Color' },
    { key: 'lineHeight', type: 'select', label: 'Line Height', options: [1.2, 1.4, 1.6, 1.8, 2.0] },
  ]
}
```

---

### 2.3 Media (Image) Section

**Type**: `media`
**Category**: Basic
**Icon**: Image
**Description**: Add images with customization options

#### Configuration Schema

```javascript
{
  type: 'media',
  defaultConfig: {
    imageUrl: '',
    alt: '',
    width: '100%',         // percentage or px
    maxWidth: '800px',
    alignment: 'center',   // left, center, right
    borderRadius: 0,       // pixels
    marginBottom: 16,
  },
  editableFields: [
    { key: 'imageUrl', type: 'image', label: 'Image', accept: '.jpg,.png,.webp' },
    { key: 'alt', type: 'text', label: 'Alt Text', placeholder: 'Describe the image' },
    { key: 'width', type: 'text', label: 'Width', placeholder: '100% or 500px' },
    { key: 'maxWidth', type: 'text', label: 'Max Width' },
    { key: 'alignment', type: 'radio', label: 'Alignment', options: ['left', 'center', 'right'] },
    { key: 'borderRadius', type: 'slider', label: 'Border Radius', min: 0, max: 50, unit: 'px' },
  ]
}
```

---

### 2.4 Button Section

**Type**: `button`
**Category**: Basic
**Icon**: MousePointerClick
**Description**: Call-to-action button

#### Configuration Schema

```javascript
{
  type: 'button',
  defaultConfig: {
    text: 'Shop Now',
    url: '#',
    style: 'primary',       // primary, secondary, outline
    size: 'medium',         // small, medium, large
    alignment: 'left',      // left, center, right
    fullWidth: false,
    backgroundColor: '#3B82F6',
    textColor: '#FFFFFF',
    borderRadius: 6,
  },
  editableFields: [
    { key: 'text', type: 'text', label: 'Button Text' },
    { key: 'url', type: 'text', label: 'URL' },
    { key: 'style', type: 'select', label: 'Style', options: ['primary', 'secondary', 'outline'] },
    { key: 'size', type: 'select', label: 'Size', options: ['small', 'medium', 'large'] },
    { key: 'alignment', type: 'radio', label: 'Alignment', options: ['left', 'center', 'right'] },
    { key: 'fullWidth', type: 'checkbox', label: 'Full Width' },
    { key: 'backgroundColor', type: 'color', label: 'Background Color' },
    { key: 'textColor', type: 'color', label: 'Text Color' },
  ]
}
```

---

### 2.5 Spacer Section

**Type**: `spacer`
**Category**: Basic
**Icon**: Space
**Description**: Add vertical spacing between sections

#### Configuration Schema

```javascript
{
  type: 'spacer',
  defaultConfig: {
    height: 32,            // pixels
  },
  editableFields: [
    { key: 'height', type: 'slider', label: 'Height', min: 8, max: 128, unit: 'px' },
  ]
}
```

---

### 2.6 Divider Section

**Type**: `divider`
**Category**: Basic
**Icon**: Minus
**Description**: Horizontal line separator

#### Configuration Schema

```javascript
{
  type: 'divider',
  defaultConfig: {
    style: 'solid',         // solid, dashed, dotted
    width: '100%',
    thickness: 1,           // pixels
    color: '#E5E7EB',
    marginTop: 16,
    marginBottom: 16,
  },
  editableFields: [
    { key: 'style', type: 'select', label: 'Style', options: ['solid', 'dashed', 'dotted'] },
    { key: 'width', type: 'text', label: 'Width', placeholder: '100% or 500px' },
    { key: 'thickness', type: 'slider', label: 'Thickness', min: 1, max: 10, unit: 'px' },
    { key: 'color', type: 'color', label: 'Color' },
  ]
}
```

---

## 3. Product Sections

### 3.1 Product Highlight Section

**Type**: `product-highlight`
**Category**: Product
**Icon**: Star
**Description**: Hero section with image, headline, features, and CTA

#### Configuration Schema

```javascript
{
  type: 'product-highlight',
  defaultConfig: {
    layout: 'image-left',    // image-left, image-right
    imageUrl: '',
    imageAlt: '',
    headline: 'Introducing Our Best Product',
    description: 'Experience the perfect blend of innovation and quality...',
    features: [
      'Premium quality materials',
      'Industry-leading performance',
      'Exceptional customer support'
    ],
    cta: {
      text: 'Shop Now',
      url: '#',
    },
    backgroundColor: '#F9FAFB',
    padding: 48,            // pixels
  },
  editableFields: [
    { key: 'layout', type: 'radio', label: 'Layout', options: ['image-left', 'image-right'] },
    { key: 'imageUrl', type: 'image', label: 'Product Image' },
    { key: 'imageAlt', type: 'text', label: 'Image Alt Text' },
    { key: 'headline', type: 'text', label: 'Headline' },
    { key: 'description', type: 'textarea', label: 'Description', rows: 4 },
    { key: 'features', type: 'list', label: 'Features', addButtonText: 'Add Feature' },
    { key: 'cta.text', type: 'text', label: 'Button Text' },
    { key: 'cta.url', type: 'text', label: 'Button URL' },
    { key: 'backgroundColor', type: 'color', label: 'Background Color' },
  ]
}
```

#### HTML Export Example

```html
<div class="pc-product-highlight" style="background-color: #F9FAFB; padding: 48px 0;">
  <div class="pc-container">
    <div class="pc-highlight-layout pc-layout-image-left">
      <div class="pc-highlight-image">
        <img src="product.jpg" alt="Product" loading="lazy">
      </div>
      <div class="pc-highlight-content">
        <h2 class="pc-highlight-headline">Introducing Our Best Product</h2>
        <p class="pc-highlight-description">Experience the perfect blend...</p>
        <ul class="pc-highlight-features">
          <li>Premium quality materials</li>
          <li>Industry-leading performance</li>
          <li>Exceptional customer support</li>
        </ul>
        <a href="#" class="pc-button pc-button-primary">Shop Now</a>
      </div>
    </div>
  </div>
</div>
```

---

### 3.2 Pros & Cons Section

**Type**: `pros-cons`
**Category**: Product
**Icon**: ThumbsUp
**Description**: Two-column comparison of pros and cons

#### Configuration Schema

```javascript
{
  type: 'pros-cons',
  defaultConfig: {
    title: 'Why Choose This Product?',
    prosLabel: 'Pros',
    consLabel: 'Cons',
    pros: [
      'High quality materials',
      'Affordable price',
      'Great customer support',
      'Fast shipping'
    ],
    cons: [
      'Limited color options',
      'Not available in all regions'
    ],
    prosColor: '#10B981',
    consColor: '#EF4444',
  },
  editableFields: [
    { key: 'title', type: 'text', label: 'Section Title' },
    { key: 'prosLabel', type: 'text', label: 'Pros Label' },
    { key: 'consLabel', type: 'text', label: 'Cons Label' },
    { key: 'pros', type: 'list', label: 'Pros', addButtonText: 'Add Pro' },
    { key: 'cons', type: 'list', label: 'Cons', addButtonText: 'Add Con' },
  ]
}
```

---

### 3.3 Specification Table Section

**Type**: `specification`
**Category**: Product
**Icon**: Table
**Description**: Technical specifications in table format

#### Configuration Schema

```javascript
{
  type: 'specification',
  defaultConfig: {
    title: 'Technical Specifications',
    specs: [
      { label: 'Weight', value: '250g' },
      { label: 'Dimensions', value: '20cm x 15cm x 5cm' },
      { label: 'Material', value: 'Aluminum' },
      { label: 'Warranty', value: '2 years' },
    ],
    striped: true,
    borderStyle: 'solid',    // solid, dashed, none
    borderColor: '#E5E7EB',
  },
  editableFields: [
    { key: 'title', type: 'text', label: 'Title' },
    { key: 'specs', type: 'table', label: 'Specifications', columns: ['label', 'value'] },
    { key: 'striped', type: 'checkbox', label: 'Alternating Row Colors' },
    { key: 'borderStyle', type: 'select', label: 'Border Style', options: ['solid', 'dashed', 'none'] },
  ]
}
```

---

### 3.4 Product Features Section

**Type**: `features`
**Category**: Product
**Icon**: Sparkles
**Description**: Grid of features with icons

#### Configuration Schema

```javascript
{
  type: 'features',
  defaultConfig: {
    title: 'Key Features',
    columns: 3,              // 2, 3, 4
    features: [
      {
        icon: 'shield',
        title: 'Durable Build',
        description: 'Built to last with premium materials'
      },
      {
        icon: 'zap',
        title: 'Fast Performance',
        description: 'Lightning-fast processing speed'
      },
      {
        icon: 'heart',
        title: 'User Friendly',
        description: 'Intuitive design for all skill levels'
      },
    ],
    iconColor: '#3B82F6',
  },
  editableFields: [
    { key: 'title', type: 'text', label: 'Section Title' },
    { key: 'columns', type: 'select', label: 'Columns', options: [2, 3, 4] },
    { key: 'features', type: 'repeater', label: 'Features', fields: [
      { key: 'icon', type: 'icon-picker', label: 'Icon' },
      { key: 'title', type: 'text', label: 'Title' },
      { key: 'description', type: 'textarea', label: 'Description', rows: 2 }
    ]},
    { key: 'iconColor', type: 'color', label: 'Icon Color' },
  ]
}
```

---

## 4. Column Sections

### 4.1 Two Column Section

**Type**: `two-column`
**Category**: Columns
**Icon**: Columns
**Description**: Two-column layout with text and image

#### Configuration Schema

```javascript
{
  type: 'two-column',
  defaultConfig: {
    layout: 'image-left',    // image-left, image-right
    imageUrl: '',
    imageAlt: '',
    title: 'Feature Title',
    content: 'Describe your feature or benefit here...',
    verticalAlign: 'center',  // top, center, bottom
    gap: 32,                  // pixels
  },
  editableFields: [
    { key: 'layout', type: 'radio', label: 'Layout', options: ['image-left', 'image-right'] },
    { key: 'imageUrl', type: 'image', label: 'Image' },
    { key: 'imageAlt', type: 'text', label: 'Alt Text' },
    { key: 'title', type: 'text', label: 'Title' },
    { key: 'content', type: 'textarea', label: 'Content', rows: 4 },
    { key: 'verticalAlign', type: 'select', label: 'Vertical Alignment', options: ['top', 'center', 'bottom'] },
    { key: 'gap', type: 'slider', label: 'Gap', min: 16, max: 64, unit: 'px' },
  ]
}
```

---

### 4.2 Three Column Section

**Type**: `three-column`
**Category**: Columns
**Icon**: LayoutGrid
**Description**: Three equal columns with images and text

#### Configuration Schema

```javascript
{
  type: 'three-column',
  defaultConfig: {
    columns: [
      {
        imageUrl: '',
        imageAlt: '',
        title: 'Feature 1',
        description: 'Description for feature 1'
      },
      {
        imageUrl: '',
        imageAlt: '',
        title: 'Feature 2',
        description: 'Description for feature 2'
      },
      {
        imageUrl: '',
        imageAlt: '',
        title: 'Feature 3',
        description: 'Description for feature 3'
      },
    ],
    gap: 24,
  },
  editableFields: [
    { key: 'columns', type: 'repeater', label: 'Columns', min: 3, max: 3, fields: [
      { key: 'imageUrl', type: 'image', label: 'Image' },
      { key: 'imageAlt', type: 'text', label: 'Alt Text' },
      { key: 'title', type: 'text', label: 'Title' },
      { key: 'description', type: 'textarea', label: 'Description', rows: 3 }
    ]},
    { key: 'gap', type: 'slider', label: 'Gap', min: 16, max: 48, unit: 'px' },
  ]
}
```

---

## 5. Media Sections

### 5.1 Gallery Section

**Type**: `gallery`
**Category**: Media
**Icon**: Images
**Description**: Grid of multiple images

#### Configuration Schema

```javascript
{
  type: 'gallery',
  defaultConfig: {
    images: [
      { url: '', alt: '' },
      { url: '', alt: '' },
      { url: '', alt: '' },
      { url: '', alt: '' },
    ],
    columns: 2,              // 2, 3, 4
    gap: 16,
    aspectRatio: 'square',   // square, wide, tall, auto
  },
  editableFields: [
    { key: 'images', type: 'repeater', label: 'Images', fields: [
      { key: 'url', type: 'image', label: 'Image' },
      { key: 'alt', type: 'text', label: 'Alt Text' }
    ]},
    { key: 'columns', type: 'select', label: 'Columns per Row', options: [2, 3, 4] },
    { key: 'gap', type: 'slider', label: 'Gap', min: 8, max: 32, unit: 'px' },
    { key: 'aspectRatio', type: 'select', label: 'Aspect Ratio', options: ['square', 'wide', 'tall', 'auto'] },
  ]
}
```

---

## 6. Advanced Sections

### 6.1 Accordion Section

**Type**: `accordion`
**Category**: Advanced
**Icon**: ChevronDown
**Description**: Expandable/collapsible content sections

#### Configuration Schema

```javascript
{
  type: 'accordion',
  defaultConfig: {
    title: 'Frequently Asked Questions',
    items: [
      {
        title: 'What is included in the box?',
        content: 'The package includes the product, charging cable, user manual, and warranty card.'
      },
      {
        title: 'What is the warranty period?',
        content: 'We offer a 2-year manufacturer warranty on all products.'
      },
      {
        title: 'How do I clean the product?',
        content: 'Use a soft, damp cloth to clean the surface. Avoid harsh chemicals.'
      },
    ],
    defaultOpen: 0,          // Index of default open item, or -1 for all closed
    allowMultiple: false,     // Allow multiple items open at once
  },
  editableFields: [
    { key: 'title', type: 'text', label: 'Section Title' },
    { key: 'items', type: 'repeater', label: 'Accordion Items', fields: [
      { key: 'title', type: 'text', label: 'Item Title' },
      { key: 'content', type: 'textarea', label: 'Item Content', rows: 3 }
    ]},
    { key: 'defaultOpen', type: 'number', label: 'Default Open Item (0-based index, -1 for closed)' },
    { key: 'allowMultiple', type: 'checkbox', label: 'Allow Multiple Open' },
  ]
}
```

---

### 6.2 Rating Section

**Type**: `rating`
**Category**: Advanced
**Icon**: Star
**Description**: Display product rating

#### Configuration Schema

```javascript
{
  type: 'rating',
  defaultConfig: {
    rating: 4.5,             // 0-5
    maxRating: 5,
    reviewCount: 127,
    showReviewCount: true,
    starColor: '#FFC107',
    size: 'medium',          // small, medium, large
    alignment: 'left',       // left, center, right
  },
  editableFields: [
    { key: 'rating', type: 'number', label: 'Rating (0-5)', min: 0, max: 5, step: 0.1 },
    { key: 'reviewCount', type: 'number', label: 'Number of Reviews' },
    { key: 'showReviewCount', type: 'checkbox', label: 'Show Review Count' },
    { key: 'starColor', type: 'color', label: 'Star Color' },
    { key: 'size', type: 'select', label: 'Size', options: ['small', 'medium', 'large'] },
    { key: 'alignment', type: 'radio', label: 'Alignment', options: ['left', 'center', 'right'] },
  ]
}
```

---

## 7. Section Registry

All sections must be registered in the section registry:

```javascript
// src/constants/sectionRegistry.js
import { SECTION_SCHEMAS } from './sectionSchemas';
import Heading from '@/components/sections/BasicSection/Heading';
import Paragraph from '@/components/sections/BasicSection/Paragraph';
// ... more imports

export const SECTION_COMPONENTS = {
  heading: Heading,
  paragraph: Paragraph,
  media: Media,
  button: Button,
  spacer: Spacer,
  divider: Divider,
  'product-highlight': ProductHighlight,
  'pros-cons': ProsCons,
  specification: Specification,
  features: Features,
  'two-column': TwoColumn,
  'three-column': ThreeColumn,
  gallery: Gallery,
  accordion: Accordion,
  rating: Rating,
};

export const getSectionComponent = (type) => {
  return SECTION_COMPONENTS[type] || null;
};

export const getSectionSchema = (type) => {
  return SECTION_SCHEMAS[type] || null;
};

export const getSectionsByCategory = (category) => {
  return Object.entries(SECTION_SCHEMAS)
    .filter(([_, schema]) => schema.category === category)
    .map(([type, schema]) => ({ type, ...schema }));
};
```

---

**End of Document**
