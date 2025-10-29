/**
 * Export Service
 * Converts sections to HTML/CSS for various formats
 */

/**
 * Generate HTML from sections
 */
export const generateHTML = (sections, projectData = {}, options = {}) => {
  try {
    const format = options.format || 'html'; // html, shopify, email
    const includeStyles = options.includeStyles !== false;
    const responsive = options.responsive !== false;

    let html = '';

    // Generate HTML for each section
    sections.forEach((section, index) => {
      html += generateSectionHTML(section, index, options);
    });

    // Wrap in container
    const wrapped = `<div class="page-crafter-content" style="width: 100%; margin: 0; padding: 0;">
${html}
</div>`;

    return {
      success: true,
      html: wrapped,
      css: includeStyles ? generateCSS(sections, options) : '',
      format,
    };
  } catch (error) {
    console.error('Export Error:', error);
    throw {
      code: 'EXPORT_ERROR',
      message: error.message || 'Failed to generate HTML',
    };
  }
};

/**
 * Generate HTML for a single section
 */
function generateSectionHTML(section, index, options = {}) {
  switch (section.type) {
    case 'hero':
      return generateHeroHTML(section, index, options);
    case 'text':
      return generateTextHTML(section, index, options);
    case 'features':
      return generateFeaturesHTML(section, index, options);
    case 'image':
      return generateImageHTML(section, index, options);
    case 'gallery':
      return generateGalleryHTML(section, index, options);
    case 'cta':
      return generateCTAHTML(section, index, options);
    case 'testimonial':
      return generateTestimonialHTML(section, index, options);
    case 'comparison':
      return generateComparisonHTML(section, index, options);
    default:
      return '';
  }
}

/**
 * Hero Section HTML
 */
function generateHeroHTML(section, index, options = {}) {
  const { title = '', subtitle = '' } = section.content || {};
  const { bgColor = '#3B82F6', padding = 'md' } = section.styles || {};
  const paddingClass = getPaddingClass(padding);

  return `
<!-- Hero Section -->
<section class="hero-section section-${index} ${paddingClass}" style="background-color: ${bgColor}; padding: 60px 20px; text-align: center; color: white;">
  <div class="hero-content" style="max-width: 800px; margin: 0 auto;">
    ${title ? `<h1 class="hero-title" style="font-size: 2.5rem; font-weight: bold; margin: 0 0 20px 0; line-height: 1.2;">${escapeHTML(title)}</h1>` : ''}
    ${subtitle ? `<p class="hero-subtitle" style="font-size: 1.25rem; margin: 0; opacity: 0.95; line-height: 1.6;">${escapeHTML(subtitle)}</p>` : ''}
  </div>
</section>
`;
}

/**
 * Text Section HTML
 */
function generateTextHTML(section, index, options = {}) {
  const { text = '' } = section.content || {};
  const { fontSize = 'base', color = '#1F2937', padding = 'md' } = section.styles || {};
  const fontSizeMap = {
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
  };
  const paddingClass = getPaddingClass(padding);

  return `
<!-- Text Section -->
<section class="text-section section-${index} ${paddingClass}" style="padding: 40px 20px; background-color: #ffffff;">
  <div class="text-content" style="max-width: 800px; margin: 0 auto; font-size: ${fontSizeMap[fontSize]}; color: ${color}; line-height: 1.8;">
    ${text
      .split('\n')
      .map((para) => (para.trim() ? `<p style="margin-bottom: 15px;">${escapeHTML(para)}</p>` : ''))
      .join('')}
  </div>
</section>
`;
}

/**
 * Features Section HTML
 */
function generateFeaturesHTML(section, index, options = {}) {
  const { items = [] } = section.content || {};
  const { padding = 'md' } = section.styles || {};
  const paddingClass = getPaddingClass(padding);

  const featureHTML = (items || [])
    .map(
      (item) => `
  <div class="feature-item" style="flex: 1; padding: 20px; text-align: center; min-width: 200px;">
    <h3 style="font-size: 1.1rem; font-weight: bold; margin: 0 0 10px 0; color: #1F2937;">${escapeHTML(item.title || 'Feature')}</h3>
    <p style="font-size: 0.95rem; color: #6B7280; margin: 0;">${escapeHTML(item.description || '')}</p>
  </div>
`
    )
    .join('');

  return `
<!-- Features Section -->
<section class="features-section section-${index} ${paddingClass}" style="padding: 40px 20px; background-color: #F9FAFB;">
  <div class="features-container" style="max-width: 1000px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 20px;">
    ${featureHTML}
  </div>
</section>
`;
}

/**
 * Image Section HTML
 */
function generateImageHTML(section, index, options = {}) {
  const { imageUrl = '', altText = 'Product image' } = section.content || {};
  const { height = 'medium' } = section.styles || {};
  const heightMap = {
    small: '200px',
    medium: '400px',
    large: '600px',
  };

  if (!imageUrl) return '';

  return `
<!-- Image Section -->
<section class="image-section section-${index}" style="padding: 20px; background-color: #ffffff; text-align: center;">
  <div class="image-container" style="max-width: 900px; margin: 0 auto;">
    <img src="${escapeHTML(imageUrl)}" alt="${escapeHTML(altText)}" style="max-width: 100%; height: ${heightMap[height]}; object-fit: cover; border-radius: 8px;" />
  </div>
</section>
`;
}

/**
 * Gallery Section HTML
 */
function generateGalleryHTML(section, index, options = {}) {
  const { images = [] } = section.content || {};

  if (!images || images.length === 0) return '';

  const galleryHTML = images
    .map(
      (img) => `
  <div class="gallery-item" style="flex: 1 1 calc(25% - 15px); min-width: 150px; aspect-ratio: 1;">
    <img src="${escapeHTML(img.url || '')}" alt="${escapeHTML(img.alt || '')}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" />
  </div>
`
    )
    .join('');

  return `
<!-- Gallery Section -->
<section class="gallery-section section-${index}" style="padding: 40px 20px; background-color: #F9FAFB;">
  <div class="gallery-container" style="max-width: 1000px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 20px;">
    ${galleryHTML}
  </div>
</section>
`;
}

/**
 * CTA Section HTML
 */
function generateCTAHTML(section, index, options = {}) {
  const { heading = '', description = '', buttonText = 'Learn More', buttonLink = '#' } = section.content || {};
  const { padding = 'md' } = section.styles || {};
  const paddingClass = getPaddingClass(padding);

  return `
<!-- CTA Section -->
<section class="cta-section section-${index} ${paddingClass}" style="padding: 40px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
  <div class="cta-content" style="max-width: 600px; margin: 0 auto; text-align: center;">
    ${heading ? `<h2 style="font-size: 1.8rem; font-weight: bold; margin: 0 0 15px 0;">${escapeHTML(heading)}</h2>` : ''}
    ${description ? `<p style="font-size: 1rem; margin: 0 0 25px 0; opacity: 0.95; line-height: 1.6;">${escapeHTML(description)}</p>` : ''}
    <a href="${escapeHTML(buttonLink)}" class="cta-button" style="display: inline-block; padding: 12px 30px; background-color: white; color: #667eea; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 1rem; transition: all 0.3s ease;">${escapeHTML(buttonText)}</a>
  </div>
</section>
`;
}

/**
 * Testimonial Section HTML
 */
function generateTestimonialHTML(section, index, options = {}) {
  const { quote = '', author = '', role = '' } = section.content || {};
  const { padding = 'md' } = section.styles || {};
  const paddingClass = getPaddingClass(padding);

  return `
<!-- Testimonial Section -->
<section class="testimonial-section section-${index} ${paddingClass}" style="padding: 40px 20px; background-color: #FEF3C7; border-left: 5px solid #F59E0B;">
  <div class="testimonial-content" style="max-width: 700px; margin: 0 auto;">
    ${quote ? `<p class="testimonial-quote" style="font-size: 1.1rem; font-style: italic; color: #1F2937; margin: 0 0 15px 0; line-height: 1.8;">"${escapeHTML(quote)}"</p>` : ''}
    <div class="testimonial-author">
      ${author ? `<p style="font-weight: bold; color: #1F2937; margin: 0;">— ${escapeHTML(author)}</p>` : ''}
      ${role ? `<p style="font-size: 0.9rem; color: #6B7280; margin: 5px 0 0 0;">${escapeHTML(role)}</p>` : ''}
    </div>
  </div>
</section>
`;
}

/**
 * Comparison Section HTML
 */
function generateComparisonHTML(section, index, options = {}) {
  const { rows = [], columns = [] } = section.content || {};

  if (!rows || rows.length === 0) {
    return `
<!-- Comparison Section -->
<section class="comparison-section section-${index}" style="padding: 40px 20px; background-color: #ffffff;">
  <p style="text-align: center; color: #6B7280;">No comparison data available</p>
</section>
`;
  }

  const headerHTML = `
  <tr style="background-color: #F3F4F6; border-bottom: 2px solid #E5E7EB;">
    ${columns.map((col) => `<th style="padding: 12px; text-align: left; font-weight: bold; color: #1F2937;">${escapeHTML(col)}</th>`).join('')}
  </tr>
`;

  const rowsHTML = rows
    .map(
      (row, rowIdx) => `
  <tr style="border-bottom: 1px solid #E5E7EB; ${rowIdx % 2 === 0 ? 'background-color: #F9FAFB;' : ''}">
    ${(row.cells || []).map((cell) => `<td style="padding: 12px; color: #4B5563;">${escapeHTML(cell)}</td>`).join('')}
  </tr>
`
    )
    .join('');

  return `
<!-- Comparison Section -->
<section class="comparison-section section-${index}" style="padding: 40px 20px; background-color: #ffffff;">
  <div class="comparison-container" style="max-width: 1000px; margin: 0 auto; overflow-x: auto;">
    <table style="width: 100%; border-collapse: collapse;">
      <thead>${headerHTML}</thead>
      <tbody>${rowsHTML}</tbody>
    </table>
  </div>
</section>
`;
}

/**
 * Generate CSS for sections
 */
function generateCSS(sections, options = {}) {
  const responsive = options.responsive !== false;

  let css = `
/* Page Crafter Generated Styles */

.page-crafter-content {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  line-height: 1.6;
  color: #1F2937;
}

section {
  transition: all 0.3s ease;
}

/* Responsive Design */
`;

  if (responsive) {
    css += `
@media (max-width: 768px) {
  .features-section .features-container,
  .gallery-section .gallery-container {
    flex-direction: column;
  }

  .feature-item,
  .gallery-item {
    flex: 1 1 100% !important;
  }

  h1 { font-size: 1.8rem; }
  h2 { font-size: 1.5rem; }
  h3 { font-size: 1.2rem; }

  .cta-button {
    width: 100%;
    box-sizing: border-box;
  }
}

@media (max-width: 480px) {
  section {
    padding: 20px 15px;
  }

  .hero-section {
    padding: 40px 15px;
  }

  h1 { font-size: 1.5rem; }
  h2 { font-size: 1.3rem; }
}
`;
  }

  css += `

/* Utility Classes */
.section-0 { /* First section */ }
.section-odd { background-color: #F9FAFB; }
.section-even { background-color: #FFFFFF; }

/* Accessibility */
a {
  color: inherit;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

table {
  border-collapse: collapse;
}

/* Print Styles */
@media print {
  .page-crafter-content {
    color: black;
    background: white;
  }

  section {
    page-break-inside: avoid;
    break-inside: avoid;
  }
}
`;

  return css;
}

/**
 * Generate Shopify-specific HTML
 */
export const generateShopifyHTML = (sections, projectData = {}) => {
  try {
    const baseHTML = generateHTML(sections, projectData, {
      format: 'shopify',
      includeStyles: true,
      responsive: true,
    });

    // Wrap in Shopify-compatible container
    const shopifyHTML = `
<div class="product-description-section">
  ${baseHTML.html}
</div>

<style>
${baseHTML.css}

/* Shopify Specific Styles */
.product-description-section {
  width: 100%;
  margin: 20px 0;
}

.product-description-section h1,
.product-description-section h2,
.product-description-section h3 {
  font-family: var(--heading-font-stack, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
  color: var(--text-color, #1F2937);
}

.product-description-section a {
  color: var(--accent-color, #667eea);
}

.product-description-section .cta-button {
  background-color: var(--accent-color, #667eea);
  color: white;
}

@media (max-width: 749px) {
  .product-description-section {
    font-size: 15px;
  }
}
</style>
`;

    return {
      success: true,
      html: shopifyHTML,
      type: 'shopify',
    };
  } catch (error) {
    console.error('Shopify Export Error:', error);
    throw {
      code: 'SHOPIFY_EXPORT_ERROR',
      message: 'Failed to generate Shopify HTML',
    };
  }
};

/**
 * Utility Functions
 */

function escapeHTML(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function getPaddingClass(padding) {
  const paddingMap = {
    sm: 'padding-sm',
    md: 'padding-md',
    lg: 'padding-lg',
    xl: 'padding-xl',
  };
  return paddingMap[padding] || 'padding-md';
}

/**
 * Generate complete HTML document
 */
export const generateHTMLDocument = (sections, projectData = {}) => {
  const { name = 'Product Description', brandColors = [] } = projectData;
  const primaryColor = brandColors[0] || '#3B82F6';

  const baseHTML = generateHTML(sections, projectData, {
    includeStyles: true,
    responsive: true,
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHTML(name)}">
  <title>${escapeHTML(name)}</title>
  <style>
    ${baseHTML.css}

    /* Document Styles */
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background-color: #ffffff;
      color: #1F2937;
    }

    .document-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .document-header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 3px solid ${primaryColor};
      margin-bottom: 40px;
    }

    .document-header h1 {
      margin: 0;
      color: ${primaryColor};
      font-size: 2.5rem;
    }
  </style>
</head>
<body>
  <div class="document-container">
    <div class="document-header">
      <h1>${escapeHTML(name)}</h1>
    </div>
    ${baseHTML.html}
  </div>
</body>
</html>`;
};

export default {
  generateHTML,
  generateShopifyHTML,
  generateHTMLDocument,
};
