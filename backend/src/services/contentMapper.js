/**
 * Content Mapper Service
 * Maps 5-stage agentic AI content to Canvas section structures
 * Implements field mapping rules from AI_GUIDELINES.md
 */

/**
 * Maps generated content from 5 stages to section structures
 *
 * @param {Object} stageContent - Content from all 5 stages
 * @param {Object} stageContent.stage1 - Problem identification
 * @param {Object} stageContent.stage2 - Solution explanation
 * @param {Object} stageContent.stage3 - Features to benefits
 * @param {Object} stageContent.stage4 - Technical specs
 * @param {Object} stageContent.stage5 - Conclusion + CTA
 * @param {Array} secondaryKeywords - Selected secondary keywords
 * @param {Array} mediaInventory - Available images/videos
 * @param {string} mainKeyword - Main product keyword (title)
 * @returns {Array} Array of section objects ready for Canvas
 */
export const mapContentToSections = (
  stageContent,
  secondaryKeywords,
  mediaInventory,
  mainKeyword
) => {
  const sections = [];
  const { stage1, stage2, stage3, stage4, stage5 } = stageContent;

  // Track which images have been used
  const availableImages = [...(mediaInventory.images || [])];
  let imageIndex = 0;

  /**
   * Helper: Get next available image with keyword-rich alt text
   */
  const getNextImage = (description) => {
    if (imageIndex >= availableImages.length) {
      return null;
    }

    const image = availableImages[imageIndex];
    const keyword = secondaryKeywords[imageIndex % secondaryKeywords.length] || mainKeyword;

    imageIndex++;

    return {
      url: image.url || image,
      alt: `${keyword} - ${description}`,
    };
  };

  /**
   * Section 1: Two Column Introduction (Stage 1 + 2)
   * Left: Problem + Solution explanation
   * Right: Product image
   */
  const introImage = getNextImage('Product overview and key features');
  if (stage2?.content) {
    sections.push({
      type: 'twoColumn',
      content: {
        leftText: stage2.content, // Already has <h2> heading with keyword
        rightImage: introImage?.url || '',
        imageAlt: introImage?.alt || '',
      },
      config: {
        imagePosition: 'right',
      },
      styles: {
        padding: 'lg',
        marginBottom: 'md',
      },
    });
  }

  /**
   * Section 2: Features (Stage 3)
   * List of features with benefit descriptions
   */
  if (stage3?.features && stage3.features.length > 0) {
    sections.push({
      type: 'features',
      content: {
        heading: `Key Features of ${secondaryKeywords[0] || mainKeyword}`,
        features: stage3.features.map((feature) => ({
          title: feature.title,
          description: feature.benefit,
          icon: null, // Optional - can be populated if icons provided
        })),
      },
      styles: {
        padding: 'lg',
        marginBottom: 'md',
      },
    });
  }

  /**
   * Section 3: How It Works (Stage 2 alternative view)
   * If we have another image, use twoColumn, otherwise use text
   */
  if (stage2?.content && availableImages.length > 1) {
    const howItWorksImage = getNextImage('Detailed product operation and functionality');

    sections.push({
      type: 'twoColumn',
      content: {
        leftText: `<h2>How ${secondaryKeywords[1] || mainKeyword} Works</h2><p>This section provides additional context about the solution mechanism.</p>`,
        rightImage: howItWorksImage?.url || '',
        imageAlt: howItWorksImage?.alt || '',
      },
      config: {
        imagePosition: 'right',
      },
      styles: {
        padding: 'lg',
        marginBottom: 'md',
      },
    });
  }

  /**
   * Section 4: Technical Specifications (Stage 4)
   * Includes comparison table if specs exist
   */
  if (stage4?.hasTable && stage4.table) {
    sections.push({
      type: 'comparison',
      content: {
        heading: `Technical Specifications`,
        table: {
          headers: stage4.table.headers || ['Specification', 'Value', 'Benefit'],
          rows: stage4.table.rows || [],
        },
      },
      styles: {
        padding: 'lg',
        marginBottom: 'md',
      },
    });
  }

  /**
   * Section 5: Spec Explanatory Text (Stage 4)
   * Rich text explaining how specs solve the problem
   */
  if (stage4?.explanatoryText) {
    sections.push({
      type: 'text',
      content: {
        text: stage4.explanatoryText, // Already has <h2> with keyword
      },
      styles: {
        padding: 'md',
        marginBottom: 'md',
      },
    });
  }

  /**
   * Section 6: Gallery (Only if 3+ images remaining)
   * Use for add-ons/accessories with descriptions
   */
  const remainingImages = availableImages.slice(imageIndex);
  if (remainingImages.length >= 3) {
    sections.push({
      type: 'gallery',
      content: {
        heading: `${secondaryKeywords[2] || mainKeyword} - Product Gallery`,
        description: 'View different angles and configurations of this product.',
        images: remainingImages.slice(0, 4).map((img, idx) => {
          const keyword = secondaryKeywords[idx % secondaryKeywords.length] || mainKeyword;
          return {
            url: img.url || img,
            alt: `${keyword} - Product view ${idx + 1}`,
          };
        }),
      },
      styles: {
        padding: 'lg',
        marginBottom: 'md',
      },
    });

    imageIndex += Math.min(4, remainingImages.length);
  }

  /**
   * Section 7: Call to Action (Stage 5)
   * Conclusion with CTA button
   */
  if (stage5?.content) {
    sections.push({
      type: 'cta',
      content: {
        text: stage5.content, // Already has <h2> and CTA copy
        buttonText: stage5.ctaButtonText || 'Shop Now',
        buttonLink: '#purchase', // Placeholder - should be configured
      },
      styles: {
        padding: 'xl',
        marginBottom: 'none',
        backgroundColor: 'primary',
      },
    });
  }

  return sections;
};

/**
 * Generates keyword-rich alt text for images
 *
 * @param {string} imageUrl - Image URL
 * @param {string} description - Image description
 * @param {Array} secondaryKeywords - Available keywords
 * @param {number} index - Image index for keyword rotation
 * @returns {string} Formatted alt text with keyword
 */
export const generateAltText = (imageUrl, description, secondaryKeywords, index = 0) => {
  const keyword = secondaryKeywords[index % secondaryKeywords.length] || 'Product';
  return `${keyword} - ${description}`;
};

/**
 * Validates section field mapping based on section type
 *
 * @param {Object} section - Section to validate
 * @returns {Object} Validation result with issues
 */
export const validateSectionFieldMapping = (section) => {
  const issues = [];

  switch (section.type) {
    case 'twoColumn':
      if (!section.content.leftText) {
        issues.push('twoColumn section missing leftText');
      }
      if (!section.content.rightImage) {
        issues.push('twoColumn section missing rightImage');
      }
      if (!section.content.imageAlt) {
        issues.push('twoColumn section missing imageAlt');
      }
      break;

    case 'gallery':
      if (!section.content.images || !Array.isArray(section.content.images)) {
        issues.push('gallery section missing images array');
      } else {
        section.content.images.forEach((img, idx) => {
          if (!img.url) issues.push(`gallery image ${idx} missing url`);
          if (!img.alt) issues.push(`gallery image ${idx} missing alt text`);
        });
      }
      break;

    case 'image':
      if (!section.content.url) {
        issues.push('image section missing url');
      }
      if (!section.content.altText) {
        issues.push('image section missing altText');
      }
      break;

    case 'features':
      if (!section.content.features || !Array.isArray(section.content.features)) {
        issues.push('features section missing features array');
      } else {
        section.content.features.forEach((feature, idx) => {
          if (!feature.title) issues.push(`feature ${idx} missing title`);
          if (!feature.description) issues.push(`feature ${idx} missing description (benefit)`);
        });
      }
      break;

    case 'comparison':
      if (!section.content.table) {
        issues.push('comparison section missing table');
      } else {
        if (!section.content.table.headers) issues.push('comparison table missing headers');
        if (!section.content.table.rows) issues.push('comparison table missing rows');
      }
      break;

    case 'cta':
      if (!section.content.text) {
        issues.push('cta section missing text');
      }
      if (!section.content.buttonText) {
        issues.push('cta section missing buttonText');
      }
      break;

    default:
      // Other section types (text, hero, etc.) have more flexible structure
      break;
  }

  return {
    valid: issues.length === 0,
    issues,
  };
};

/**
 * Applies smart section selection logic based on content analysis
 *
 * @param {Object} productContext - Product information
 * @param {Object} stageContent - Generated content from 5 stages
 * @returns {Array} Recommended section types in priority order
 */
export const recommendSectionTypes = (productContext, stageContent) => {
  const recommendations = [];

  // ALWAYS start with twoColumn for introduction (not hero)
  recommendations.push({
    type: 'twoColumn',
    reason: 'Standard introduction pattern - most effective for first block',
    priority: 1,
  });

  // ALWAYS include features if we have them
  if (stageContent.stage3?.features?.length > 0) {
    recommendations.push({
      type: 'features',
      reason: 'Feature-benefit mapping available from Stage 3',
      priority: 2,
    });
  }

  // Include comparison table if technical specs exist
  if (stageContent.stage4?.hasTable) {
    recommendations.push({
      type: 'comparison',
      reason: 'Technical specifications available for comparison table',
      priority: 3,
    });
  }

  // Include text section for spec explanations
  if (stageContent.stage4?.explanatoryText) {
    recommendations.push({
      type: 'text',
      reason: 'Explanatory text for technical specifications',
      priority: 4,
    });
  }

  // RARELY use gallery - only if 3+ images AND add-ons detected
  const imageCount = productContext.mediaInventory?.images?.length || 0;
  const hasAddOns = productContext.supplierDescription?.toLowerCase().includes('accessory') ||
                    productContext.supplierDescription?.toLowerCase().includes('add-on') ||
                    productContext.supplierDescription?.toLowerCase().includes('includes:');

  if (imageCount >= 3 && hasAddOns) {
    recommendations.push({
      type: 'gallery',
      reason: 'Multiple images available and add-ons/accessories detected',
      priority: 5,
    });
  }

  // ALWAYS end with CTA
  recommendations.push({
    type: 'cta',
    reason: 'Conclusion with call-to-action from Stage 5',
    priority: 6,
  });

  return recommendations.sort((a, b) => a.priority - b.priority);
};

/**
 * Smart Section Builder
 * Takes orchestrator output and builds 2-8 Canvas sections
 * Intelligently maps problem-solutions to section types and adds supporting content
 */
export const buildSmartSections = (orchestratorOutput) => {
  const {
    content,
    userProvidedContent = {},
    mediaInventory = {},
    secondaryKeywords = [],
    mainKeyword,
  } = orchestratorOutput;

  const sections = [];
  const { problemSolutions, features, specs, softCTA } = content;

  // Track image usage
  const availableImages = [...(mediaInventory.images || [])];
  let imageIndex = 0;

  /**
   * Helper: Get next image with keyword-rich alt text
   */
  const getNextImage = (description) => {
    if (imageIndex >= availableImages.length) return null;

    const image = availableImages[imageIndex];
    const keyword = secondaryKeywords[imageIndex % secondaryKeywords.length] || mainKeyword;
    imageIndex++;

    return {
      url: image.url || image,
      alt: `${keyword} - ${description}`,
    };
  };

  // ========================================
  // PROBLEM-SOLUTION SECTIONS (2-4 sections)
  // ========================================

  problemSolutions.forEach((ps, index) => {
    const isLastProblem = index === problemSolutions.length - 1;

    // Decide section type based on position and available content
    if (index === 0) {
      // First section: Always twoColumn with image
      const image = getNextImage('Product overview and key features');
      sections.push({
        type: 'twoColumn',
        content: {
          leftText: ps.solution,
          rightImage: image?.url || '',
          imageAlt: image?.alt || '',
        },
        config: {
          imagePosition: 'right',
        },
        styles: {
          padding: 'lg',
          marginBottom: 'md',
        },
      });
    } else if (index === 1 && features.features && features.features.length > 0) {
      // Second section: Display ALL features (can span multiple sections if needed)
      // If 8 or fewer features: one section
      // If more than 8 features: split across multiple sections
      const FEATURES_PER_SECTION = 8;
      const totalFeatures = features.features.length;

      if (totalFeatures <= FEATURES_PER_SECTION) {
        // All features fit in one section
        sections.push({
          type: 'features',
          content: {
            heading: `Key Features of ${secondaryKeywords[0] || mainKeyword}`,
            features: features.features.map((feature) => ({
              title: feature.title,
              description: feature.benefit,
              icon: null,
            })),
          },
          styles: {
            padding: 'lg',
            marginBottom: 'md',
          },
        });
      } else {
        // Split features across multiple sections
        const numSections = Math.ceil(totalFeatures / FEATURES_PER_SECTION);
        for (let i = 0; i < numSections; i++) {
          const startIdx = i * FEATURES_PER_SECTION;
          const endIdx = Math.min(startIdx + FEATURES_PER_SECTION, totalFeatures);
          const featureSlice = features.features.slice(startIdx, endIdx);

          sections.push({
            type: 'features',
            content: {
              heading: i === 0
                ? `Key Features of ${secondaryKeywords[0] || mainKeyword}`
                : `More Features of ${secondaryKeywords[1] || mainKeyword}`,
              features: featureSlice.map((feature) => ({
                title: feature.title,
                description: feature.benefit,
                icon: null,
              })),
            },
            styles: {
              padding: 'lg',
              marginBottom: 'md',
            },
          });
        }
      }
    } else {
      // Other problem sections: Use text or twoColumn depending on image availability
      const hasImageAvailable = imageIndex < availableImages.length;

      if (hasImageAvailable && !isLastProblem) {
        const image = getNextImage('Product functionality and use case');
        sections.push({
          type: 'twoColumn',
          content: {
            leftText: ps.solution,
            rightImage: image?.url || '',
            imageAlt: image?.alt || '',
          },
          config: {
            imagePosition: 'right',
          },
          styles: {
            padding: 'lg',
            marginBottom: 'md',
          },
        });
      } else {
        // Last problem section OR no images: Use text with soft CTA
        const textContent = isLastProblem
          ? `${ps.solution}\n\n${softCTA}`
          : ps.solution;

        sections.push({
          type: 'text',
          content: {
            text: textContent,
          },
          styles: {
            padding: 'md',
            marginBottom: 'md',
          },
        });
      }
    }
  });

  // ========================================
  // SUPPORTING SECTIONS (0-4 sections)
  // ========================================

  // Add spec table if available
  if (specs.hasTable && specs.table) {
    const specImage = getNextImage('Technical specifications and dimensions');
    sections.push({
      type: 'comparison',
      content: {
        heading: `Technical Specifications`,
        table: {
          headers: specs.table.headers || ['Specification', 'Value', 'Benefit'],
          rows: specs.table.rows || [],
        },
      },
      styles: {
        padding: 'lg',
        marginBottom: 'md',
      },
    });
  }

  // Add user-provided review image if available
  if (userProvidedContent.reviewImage) {
    sections.push({
      type: 'image',
      content: {
        url: userProvidedContent.reviewImage,
        altText: `${mainKeyword} - Customer review and testimonial`,
      },
      styles: {
        padding: 'md',
        marginBottom: 'md',
      },
    });
  }

  // Add installation manual gallery if provided
  if (userProvidedContent.installationManual && Array.isArray(userProvidedContent.installationManual)) {
    sections.push({
      type: 'gallery',
      content: {
        heading: `${secondaryKeywords[2] || mainKeyword} - Installation Guide`,
        description: 'Step-by-step installation instructions and manual.',
        images: userProvidedContent.installationManual.map((imgUrl, idx) => ({
          url: imgUrl,
          alt: `${mainKeyword} - Installation step ${idx + 1}`,
        })),
      },
      styles: {
        padding: 'lg',
        marginBottom: 'md',
      },
    });
  }

  // Add YouTube video if provided
  if (userProvidedContent.videoUrl) {
    sections.push({
      type: 'video',
      content: {
        videoUrl: userProvidedContent.videoUrl,
        heading: `${mainKeyword} - Product Demonstration`,
        description: 'Watch this product in action.',
      },
      styles: {
        padding: 'lg',
        marginBottom: 'md',
      },
    });
  }

  // Limit to 8 sections max
  return sections.slice(0, 8);
};

export default {
  mapContentToSections,
  generateAltText,
  validateSectionFieldMapping,
  recommendSectionTypes,
  buildSmartSections,
};
