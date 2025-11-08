import { z } from 'zod';

/**
 * Section Builder Framework - Section Type Schemas
 * Validates generated section content against expected structure
 */

// Allowed section types - Must match Canvas renderer supported types
export const SectionType = z.enum([
  'hero',
  'text',
  'features',
  'image',
  'gallery',
  'cta',
  'testimonial',
  'comparison',
  'twoColumn',
  'sideBySide',
  'threeColumns',
  'fourColumns',
  'twoColumnHighlight',
]);

// Base section plan schema (output from planner)
export const SectionPlanSchema = z.object({
  index: z.number().int().min(1).max(8),
  type: SectionType,
  goal: z.string().min(1),
  source_refs: z.array(z.string()),
  min_required_fields: z.array(z.string()),
  constraints: z.object({
    title_max_words: z.number().int().optional(),
    subtitle_max_words: z.number().int().optional(),
  }),
  confidence: z.number().min(0).max(1),
  notes: z.object({
    issues: z.array(z.string()),
    todos: z.array(z.string()),
    split_reason: z.string().nullable(),
    merge_reason: z.string().nullable(),
  }),
});

// Section plan array validation
export const SectionPlanArraySchema = z.array(SectionPlanSchema).min(2).max(8);

// Hero section schema
export const HeroSchema = z.object({
  title: z.string().min(1).max(200),
  subtitle: z.string().min(1).max(500),
});

// Text section schema
export const TextSchema = z.object({
  text: z.string().min(1),
});

// Features section schema
export const FeaturesSchema = z.object({
  features: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.any().nullable(),
  })),
});

// Image section schema
export const ImageSchema = z.object({
  url: z.string().optional(),
  altText: z.string().optional(),
});

// Gallery section schema
export const GallerySchema = z.object({
  images: z.array(z.object({
    url: z.string(),
    title: z.string().optional(),
    alt: z.string().optional(),
  })).min(1),
});

// CTA section schema
export const CTASchema = z.object({
  buttonText: z.string(),
  buttonLink: z.string(),
});

// Testimonial section schema
export const TestimonialSchema = z.object({
  testimonials: z.array(z.object({
    quote: z.string(),
    author: z.string(),
    authorTitle: z.string().optional(),
    photo: z.string().nullable().optional(),
  })),
});

// Comparison section schema
export const ComparisonSchema = z.object({
  table: z.object({
    headers: z.array(z.string()),
    rows: z.array(z.array(z.string())),
  }),
  text: z.string().optional(),
});

// Two column section schema
export const TwoColumnSchema = z.object({
  leftText: z.string(),
  rightImage: z.string().nullable().optional(),
});

// Side by side section schema
export const SideBySideSchema = z.object({
  col1Text: z.string(),
  col2Text: z.string(),
  col1Image: z.string().nullable().optional(),
  col2Image: z.string().nullable().optional(),
});

// Three columns section schema
export const ThreeColumnsSchema = z.object({
  col1Text: z.string(),
  col2Text: z.string(),
  col3Text: z.string(),
  col1Image: z.string().nullable().optional(),
  col2Image: z.string().nullable().optional(),
  col3Image: z.string().nullable().optional(),
});

// Four columns section schema
export const FourColumnsSchema = z.object({
  col1Text: z.string(),
  col2Text: z.string(),
  col3Text: z.string(),
  col4Text: z.string(),
  col1Image: z.string().nullable().optional(),
  col2Image: z.string().nullable().optional(),
  col3Image: z.string().nullable().optional(),
  col4Image: z.string().nullable().optional(),
});

// Two column highlight section schema
export const TwoColumnHighlightSchema = z.object({
  richText: z.string(),
  mediaUrl: z.string().nullable().optional(),
  mediaType: z.enum(['image', 'video']).optional(),
});

// Validation result schema
export const ValidationResultSchema = z.object({
  valid: z.boolean(),
  fixed: z.any().nullable(),
  reasons: z.array(z.string()),
});

// Helper: Get schema for section type
export function getSchemaForType(type) {
  const schemas = {
    hero: HeroSchema,
    text: TextSchema,
    features: FeaturesSchema,
    image: ImageSchema,
    gallery: GallerySchema,
    cta: CTASchema,
    testimonial: TestimonialSchema,
    comparison: ComparisonSchema,
    twoColumn: TwoColumnSchema,
    sideBySide: SideBySideSchema,
    threeColumns: ThreeColumnsSchema,
    fourColumns: FourColumnsSchema,
    twoColumnHighlight: TwoColumnHighlightSchema,
  };

  return schemas[type] || TextSchema;
}

export default {
  SectionType,
  SectionPlanSchema,
  SectionPlanArraySchema,
  HeroSchema,
  TextSchema,
  FeaturesSchema,
  ImageSchema,
  GallerySchema,
  CTASchema,
  TestimonialSchema,
  ComparisonSchema,
  TwoColumnSchema,
  SideBySideSchema,
  ThreeColumnsSchema,
  FourColumnsSchema,
  TwoColumnHighlightSchema,
  ValidationResultSchema,
  getSchemaForType,
};
