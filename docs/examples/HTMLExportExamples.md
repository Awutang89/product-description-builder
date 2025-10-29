# Page Crafter - HTML Export Format Examples

## Document Information
- **Version**: 1.0
- **Last Updated**: 2025-10-25
- **Purpose**: Complete HTML export examples for Shopify compatibility

---

## Table of Contents
1. [Export Structure](#1-export-structure)
2. [Complete Product Page Example](#2-complete-product-page-example)
3. [Section-by-Section Examples](#3-section-by-section-examples)
4. [Responsive CSS](#4-responsive-css)
5. [Shopify Integration Guide](#5-shopify-integration-guide)

---

## 1. Export Structure

### 1.1 Full Export Format

```html
<style>
  /* Page Crafter Styles */
  /* Base styles, section-specific styles, responsive styles */
</style>

<div class="page-crafter-content">
  <!-- Section 1 HTML -->
  <!-- Section 2 HTML -->
  <!-- Section 3 HTML -->
  <!-- ... -->
</div>
```

### 1.2 CSS Naming Convention

- **Prefix**: All classes start with `pc-` (Page Crafter)
- **Section Classes**: `pc-{section-type}` (e.g., `pc-heading`, `pc-product-highlight`)
- **Unique IDs**: `pc-{section-type}-{section-id}` for section-specific styles
- **Utility Classes**: `pc-container`, `pc-button`, etc.

---

## 2. Complete Product Page Example

### 2.1 Full HTML Export

```html
<style>
/* Page Crafter Base Styles */
.page-crafter-content {
  max-width: 100%;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #333333;
  line-height: 1.6;
}

.pc-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* Heading Styles */
.pc-heading {
  margin-top: 0;
  line-height: 1.2;
}

.pc-heading-section1 {
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  margin-top: 24px;
  margin-bottom: 16px;
}

/* Paragraph Styles */
.pc-paragraph {
  line-height: 1.6;
  margin-bottom: 16px;
}

.pc-paragraph-section2 {
  font-size: 16px;
  text-align: center;
}

/* Product Highlight Styles */
.pc-product-highlight {
  padding: 48px 0;
}

.pc-highlight-layout {
  display: flex;
  gap: 32px;
  align-items: center;
}

.pc-layout-image-left {
  flex-direction: row;
}

.pc-layout-image-right {
  flex-direction: row-reverse;
}

.pc-highlight-image {
  flex: 1;
}

.pc-highlight-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.pc-highlight-content {
  flex: 1;
}

.pc-highlight-headline {
  font-size: 28px;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 16px;
  color: #111827;
}

.pc-highlight-description {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 24px;
  color: #4B5563;
}

.pc-highlight-features {
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
}

.pc-highlight-features li {
  padding-left: 28px;
  position: relative;
  margin-bottom: 12px;
  font-size: 16px;
  color: #374151;
}

.pc-highlight-features li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #10B981;
  font-weight: bold;
  font-size: 18px;
}

/* Button Styles */
.pc-button {
  display: inline-block;
  padding: 12px 32px;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s;
  text-align: center;
}

.pc-button-primary {
  background-color: #3B82F6;
  color: #FFFFFF;
}

.pc-button-primary:hover {
  background-color: #2563EB;
}

/* Pros & Cons Styles */
.pc-pros-cons {
  padding: 48px 0;
  background-color: #F9FAFB;
}

.pc-pros-cons-title {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 32px;
  color: #111827;
}

.pc-pros-cons-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.pc-pros, .pc-cons {
  background: #FFFFFF;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.pc-pros-label, .pc-cons-label {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
}

.pc-pros-label {
  color: #10B981;
}

.pc-cons-label {
  color: #EF4444;
}

.pc-pros-list, .pc-cons-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.pc-pros-list li, .pc-cons-list li {
  padding-left: 28px;
  position: relative;
  margin-bottom: 12px;
  font-size: 16px;
  color: #374151;
}

.pc-pros-list li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #10B981;
  font-weight: bold;
}

.pc-cons-list li:before {
  content: "✗";
  position: absolute;
  left: 0;
  color: #EF4444;
  font-weight: bold;
}

/* Specification Table Styles */
.pc-specification {
  padding: 48px 0;
}

.pc-spec-title {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 32px;
  color: #111827;
}

.pc-spec-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto;
  max-width: 800px;
}

.pc-spec-table tr {
  border-bottom: 1px solid #E5E7EB;
}

.pc-spec-table tr:nth-child(even) {
  background-color: #F9FAFB;
}

.pc-spec-table td {
  padding: 16px;
  font-size: 16px;
}

.pc-spec-table td:first-child {
  font-weight: 600;
  color: #111827;
  width: 40%;
}

.pc-spec-table td:last-child {
  color: #4B5563;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .pc-heading-section1 {
    font-size: 28px;
  }

  .pc-highlight-layout {
    flex-direction: column !important;
  }

  .pc-highlight-headline {
    font-size: 24px;
  }

  .pc-pros-cons-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .pc-button {
    display: block;
    width: 100%;
  }

  .pc-spec-table td {
    display: block;
    width: 100% !important;
  }

  .pc-spec-table td:first-child {
    padding-bottom: 8px;
  }

  .pc-spec-table td:last-child {
    padding-top: 0;
  }
}
</style>

<div class="page-crafter-content">
  <!-- Section 1: Heading -->
  <div class="pc-container">
    <h1 class="pc-heading pc-heading-section1" style="color: #111827;">
      Premium Wireless Headphones
    </h1>
  </div>

  <!-- Section 2: Intro Paragraph -->
  <div class="pc-container">
    <p class="pc-paragraph pc-paragraph-section2" style="color: #4B5563;">
      Experience audio perfection with our industry-leading wireless headphones. Designed for professionals and audiophiles who demand the best.
    </p>
  </div>

  <!-- Section 3: Product Highlight -->
  <div class="pc-product-highlight" style="background-color: #FFFFFF;">
    <div class="pc-container">
      <div class="pc-highlight-layout pc-layout-image-left">
        <div class="pc-highlight-image">
          <img src="https://via.placeholder.com/600x400" alt="Premium Wireless Headphones" loading="lazy">
        </div>
        <div class="pc-highlight-content">
          <h2 class="pc-highlight-headline">Immersive Audio Experience</h2>
          <p class="pc-highlight-description">
            Lose yourself in crystal-clear sound with our advanced audio technology. Active Noise Cancellation blocks out distractions, while premium drivers deliver rich, detailed audio across all frequencies.
          </p>
          <ul class="pc-highlight-features">
            <li>Industry-leading Active Noise Cancellation</li>
            <li>40-hour battery life for all-day listening</li>
            <li>Premium comfort with memory foam cushions</li>
            <li>Bluetooth 5.0 for stable wireless connection</li>
          </ul>
          <a href="#" class="pc-button pc-button-primary">Shop Now - $299</a>
        </div>
      </div>
    </div>
  </div>

  <!-- Section 4: Pros & Cons -->
  <div class="pc-pros-cons">
    <div class="pc-container">
      <h2 class="pc-pros-cons-title">Honest Review</h2>
      <div class="pc-pros-cons-grid">
        <div class="pc-pros">
          <h3 class="pc-pros-label">Pros</h3>
          <ul class="pc-pros-list">
            <li>Exceptional sound quality with deep bass</li>
            <li>Best-in-class noise cancellation</li>
            <li>Extremely comfortable for long listening sessions</li>
            <li>Impressive 40-hour battery life</li>
            <li>Premium build quality and materials</li>
          </ul>
        </div>
        <div class="pc-cons">
          <h3 class="pc-cons-label">Cons</h3>
          <ul class="pc-cons-list">
            <li>Limited to two color options</li>
            <li>Higher price point than competitors</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Section 5: Specifications -->
  <div class="pc-specification">
    <div class="pc-container">
      <h2 class="pc-spec-title">Technical Specifications</h2>
      <table class="pc-spec-table">
        <tbody>
          <tr>
            <td>Weight</td>
            <td>250g</td>
          </tr>
          <tr>
            <td>Driver Size</td>
            <td>40mm dynamic drivers</td>
          </tr>
          <tr>
            <td>Frequency Response</td>
            <td>20Hz - 20kHz</td>
          </tr>
          <tr>
            <td>Battery Life</td>
            <td>40 hours (ANC on), 50 hours (ANC off)</td>
          </tr>
          <tr>
            <td>Charging Time</td>
            <td>2 hours (USB-C fast charging)</td>
          </tr>
          <tr>
            <td>Connectivity</td>
            <td>Bluetooth 5.0, 3.5mm aux cable</td>
          </tr>
          <tr>
            <td>Warranty</td>
            <td>2 years manufacturer warranty</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
```

---

## 3. Section-by-Section Examples

### 3.1 Heading Section Export

```html
<div class="pc-container">
  <h2 class="pc-heading pc-heading-abc123" style="color: #111827;">
    Your Amazing Product
  </h2>
</div>
```

```css
.pc-heading-abc123 {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-top: 24px;
  margin-bottom: 16px;
  line-height: 1.2;
}
```

---

### 3.2 Two Column Section Export

```html
<div class="pc-two-column">
  <div class="pc-container">
    <div class="pc-two-column-layout pc-layout-image-left">
      <div class="pc-two-column-image">
        <img src="feature.jpg" alt="Feature Image" loading="lazy">
      </div>
      <div class="pc-two-column-content">
        <h3 class="pc-two-column-title">Premium Design</h3>
        <p class="pc-two-column-text">
          Crafted with attention to detail, our product combines elegant aesthetics with practical functionality. Every element is designed to enhance your experience.
        </p>
      </div>
    </div>
  </div>
</div>
```

```css
.pc-two-column {
  padding: 48px 0;
}

.pc-two-column-layout {
  display: flex;
  gap: 32px;
  align-items: center;
}

.pc-layout-image-left {
  flex-direction: row;
}

.pc-layout-image-right {
  flex-direction: row-reverse;
}

.pc-two-column-image,
.pc-two-column-content {
  flex: 1;
}

.pc-two-column-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .pc-two-column-layout {
    flex-direction: column !important;
  }
}
```

---

### 3.3 Accordion Section Export

```html
<div class="pc-accordion">
  <div class="pc-container">
    <h2 class="pc-accordion-title">Frequently Asked Questions</h2>

    <div class="pc-accordion-item">
      <div class="pc-accordion-header">
        <h3>What is included in the box?</h3>
        <span class="pc-accordion-icon">+</span>
      </div>
      <div class="pc-accordion-content">
        <p>The package includes the headphones, charging cable, carrying case, 3.5mm audio cable, user manual, and warranty card.</p>
      </div>
    </div>

    <div class="pc-accordion-item">
      <div class="pc-accordion-header">
        <h3>How long does the battery last?</h3>
        <span class="pc-accordion-icon">+</span>
      </div>
      <div class="pc-accordion-content">
        <p>The battery provides up to 40 hours of playtime with ANC on, and 50 hours with ANC off. Fast charging gives you 5 hours of playback in just 10 minutes.</p>
      </div>
    </div>

    <div class="pc-accordion-item">
      <div class="pc-accordion-header">
        <h3>Is there a warranty?</h3>
        <span class="pc-accordion-icon">+</span>
      </div>
      <div class="pc-accordion-content">
        <p>Yes, all products come with a 2-year manufacturer warranty covering defects in materials and workmanship.</p>
      </div>
    </div>
  </div>
</div>
```

```css
.pc-accordion {
  padding: 48px 0;
}

.pc-accordion-title {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 32px;
  color: #111827;
}

.pc-accordion-item {
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;
}

.pc-accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  background: #FFFFFF;
  transition: background 0.2s;
}

.pc-accordion-header:hover {
  background: #F9FAFB;
}

.pc-accordion-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.pc-accordion-icon {
  font-size: 24px;
  font-weight: 300;
  color: #6B7280;
}

.pc-accordion-content {
  padding: 0 20px 16px;
  color: #4B5563;
  line-height: 1.6;
}

.pc-accordion-content p {
  margin: 0;
}

/* Note: Interactive behavior requires JavaScript (not included in static export) */
/* For Shopify, consider using <details> and <summary> tags for native accordion */
```

---

## 4. Responsive CSS

### 4.1 Mobile-First Approach

```css
/* Base styles (mobile) */
.pc-container {
  padding: 0 16px;
}

.pc-highlight-layout {
  flex-direction: column;
}

/* Tablet and up */
@media (min-width: 768px) {
  .pc-container {
    padding: 0 24px;
  }

  .pc-highlight-layout {
    flex-direction: row;
  }

  .pc-pros-cons-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .pc-container {
    padding: 0 32px;
  }
}
```

### 4.2 Common Responsive Patterns

```css
/* Stack columns on mobile */
@media (max-width: 768px) {
  .pc-two-column-layout,
  .pc-three-column-layout,
  .pc-highlight-layout {
    flex-direction: column !important;
  }

  /* Full-width buttons on mobile */
  .pc-button {
    display: block;
    width: 100%;
    text-align: center;
  }

  /* Reduce spacing on mobile */
  .pc-product-highlight,
  .pc-pros-cons,
  .pc-specification {
    padding: 32px 0;
  }

  /* Reduce font sizes on mobile */
  .pc-heading-section1 {
    font-size: 28px;
  }

  .pc-highlight-headline {
    font-size: 24px;
  }

  /* Adjust table for mobile */
  .pc-spec-table td {
    display: block;
    width: 100%;
    padding: 8px 16px;
  }

  .pc-spec-table td:first-child {
    font-weight: 700;
    padding-bottom: 4px;
  }

  .pc-spec-table td:last-child {
    padding-top: 4px;
    padding-bottom: 16px;
  }
}
```

---

## 5. Shopify Integration Guide

### 5.1 How to Add to Shopify

**Step 1: Export HTML**
1. Click "Export HTML" in Page Crafter
2. Click "Copy to Clipboard"

**Step 2: Navigate to Product in Shopify**
1. Log into Shopify admin
2. Go to Products → All Products
3. Select the product you want to edit
4. Scroll to "Description" section

**Step 3: Switch to HTML Mode**
1. Click "Show HTML" button (looks like `<>`)
2. Paste the copied HTML
3. Preview the result

**Step 4: Save**
1. Click "Save" at the bottom
2. View product page on your store to verify

---

### 5.2 Using `<details>` and `<summary>` for Accordions

For native interactive accordions without JavaScript:

```html
<div class="pc-accordion">
  <div class="pc-container">
    <h2>Frequently Asked Questions</h2>

    <details class="pc-accordion-item">
      <summary class="pc-accordion-header">
        <span>What is included in the box?</span>
      </summary>
      <div class="pc-accordion-content">
        <p>The package includes the headphones, charging cable, carrying case, 3.5mm audio cable, user manual, and warranty card.</p>
      </div>
    </details>

    <details class="pc-accordion-item">
      <summary class="pc-accordion-header">
        <span>How long does the battery last?</span>
      </summary>
      <div class="pc-accordion-content">
        <p>The battery provides up to 40 hours of playtime with ANC on, and 50 hours with ANC off.</p>
      </div>
    </details>
  </div>
</div>
```

```css
.pc-accordion-item {
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  margin-bottom: 12px;
}

.pc-accordion-header {
  padding: 16px 20px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  list-style: none;
}

.pc-accordion-header::-webkit-details-marker {
  display: none;
}

.pc-accordion-content {
  padding: 0 20px 16px;
  color: #4B5563;
}
```

---

### 5.3 Shopify Compatibility Checklist

- ✅ **No external dependencies** (CSS frameworks, fonts)
- ✅ **Inline or embedded styles** (no external CSS files)
- ✅ **No JavaScript** (or optional progressive enhancement)
- ✅ **Semantic HTML5** tags
- ✅ **Alt text** on all images
- ✅ **Responsive design** with media queries
- ✅ **Shopify Liquid** compatible (no conflicts)
- ✅ **Theme-agnostic** (works with any theme)
- ✅ **Performance optimized** (lazy loading images)

---

### 5.4 Troubleshooting

**Problem**: Styles not applying correctly

**Solution**:
- Increase CSS specificity: `.page-crafter-content .pc-heading { }`
- Use `!important` sparingly if theme CSS conflicts
- Check for theme CSS overrides

---

**Problem**: Images not loading

**Solution**:
- Ensure image URLs are absolute (not relative)
- Upload images to Shopify Files section first
- Use Shopify CDN URLs

---

**Problem**: Layout breaks on mobile

**Solution**:
- Test with Shopify's mobile preview
- Verify media queries are included
- Use `!important` on critical responsive styles if needed

---

**Problem**: Accordion not working

**Solution**:
- Use `<details>` and `<summary>` tags for native behavior
- If using custom JS, ensure it's Shopify-compatible
- Test in Shopify preview mode

---

## 6. Alternative: Inline Styles Version

For maximum compatibility, export with inline styles:

```html
<div style="max-width: 100%; margin: 0 auto; font-family: Arial, sans-serif;">
  <div style="max-width: 1200px; margin: 0 auto; padding: 0 16px;">
    <h1 style="font-size: 36px; font-weight: 700; text-align: center; color: #111827; margin: 24px 0 16px;">
      Premium Wireless Headphones
    </h1>

    <p style="font-size: 16px; text-align: center; color: #4B5563; line-height: 1.6; margin-bottom: 16px;">
      Experience audio perfection with our industry-leading wireless headphones.
    </p>
  </div>

  <div style="padding: 48px 0; background-color: #FFFFFF;">
    <div style="max-width: 1200px; margin: 0 auto; padding: 0 16px;">
      <div style="display: flex; gap: 32px; align-items: center;">
        <div style="flex: 1;">
          <img src="product.jpg" alt="Product" style="width: 100%; height: auto; border-radius: 8px;">
        </div>
        <div style="flex: 1;">
          <h2 style="font-size: 28px; font-weight: 700; color: #111827; margin-bottom: 16px;">
            Immersive Audio Experience
          </h2>
          <p style="font-size: 16px; color: #4B5563; line-height: 1.6; margin-bottom: 24px;">
            Lose yourself in crystal-clear sound with our advanced audio technology.
          </p>
          <a href="#" style="display: inline-block; padding: 12px 32px; background-color: #3B82F6; color: #FFFFFF; text-decoration: none; border-radius: 6px; font-weight: 600;">
            Shop Now
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
```

**Note**: Inline styles increase HTML size but ensure compatibility across all Shopify themes.

---

**End of Document**
