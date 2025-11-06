import { z } from 'zod';

/**
 * Section Builder Framework - Section Type Schemas
 * Validates generated section content against expected structure
 */

// Allowed section types
export const SectionType = z.enum([
  'introSummary',
  'imageWithBenefits',
  'benefitsTextSoftCTA',
  'imageReview',
  'manualsLinks',
  'specTable',
  'comparisonTable',
  'faq',
  'gallery',
  'shippingReturns',
  'warrantyCompliance',
  'text', // fallback
]);

// Base section plan schema (output from planner)
export const SectionPlanSchema = z.object({
  index: z.number().int().min(1).max(8),
  type: SectionType,
  goal: z.string().min(1),
  source_refs: z.array(z.string()),
  min_required_fields: z.array(z.string()),
  constraints: z.object({
    max_bullets: z.number().int().optional(),
    listMode: z.boolean().optional(),
    groupBy: z.enum(['theme', 'specGroup', 'null']).optional(),
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

// Individual section content schemas
export const IntroSummarySchema = z.object({
  heading: z.string().min(1).max(100),
  subhead: z.string().min(1).max(200).optional(),
  storage_line: z.string().optional(),
  body: z.string().min(40).max(300),
  badges: z.array(z.string()).optional(),
});

export const ImageWithBenefitsSchema = z.object({
  heading: z.string().min(1).max(100),
  bullets: z.array(z.string()).min(4).max(8),
  image_intent: z.string(),
  caption: z.string().optional(),
  qa_sources: z.array(z.string()),
});

export const BenefitsTextSoftCTASchema = z.object({
  heading: z.string().min(1).max(100),
  paragraphs: z.array(z.string()).min(1).max(3),
  soft_cta_sentence: z.string().min(1),
});

export const ImageReviewSchema = z.object({
  heading: z.string().min(1).max(100),
  quote: z.string().min(10),
  author: z.string().optional(),
  image_required: z.boolean(),
  alt_hint: z.string(),
});

export const ManualsLinksSchema = z.object({
  heading: z.string().min(1).max(100),
  links: z.array(
    z.object({
      label: z.string(),
      url: z.string().url(),
    })
  ),
  note: z.string().optional(),
});

export const SpecTableSchema = z.object({
  heading: z.string().min(1).max(100),
  mode: z.enum(['table', 'list']),
  columns: z.array(z.string()).optional(), // for table mode
  rows: z.array(z.array(z.string())).optional(), // for table mode
  listItems: z.array(z.string()).optional(), // for list mode
  unit_notes: z.string().optional(),
});

export const ComparisonTableSchema = z.object({
  heading: z.string().min(1).max(100),
  columns: z.array(z.string()).min(2),
  rows: z.array(z.array(z.string())),
});

export const FAQSchema = z.object({
  heading: z.string().min(1).max(100),
  items: z.array(
    z.object({
      q: z.string(),
      a: z.string(),
    })
  ).min(3).max(8),
});

export const GallerySchema = z.object({
  heading: z.string().min(1).max(100),
  image_intent: z.string(),
  captions: z.array(z.string()).optional(),
});

export const ShippingReturnsSchema = z.object({
  heading: z.string().min(1).max(100),
  bullets: z.array(z.string()).min(2),
});

export const WarrantyComplianceSchema = z.object({
  heading: z.string().min(1).max(100),
  bullets: z.array(z.string()).min(2),
});

export const TextFallbackSchema = z.object({
  heading: z.string().min(1).max(100),
  body: z.string().min(50).max(300),
  todo: z.array(z.string()),
});

// Media assignment schema
export const MediaAssignmentSchema = z.object({
  section_index: z.number().int(),
  image_id: z.string().nullable(),
  video_id: z.string().nullable(),
  alt_text: z.record(z.string()).optional(),
  rationale: z.string(),
  todos: z.array(z.string()),
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
    introSummary: IntroSummarySchema,
    imageWithBenefits: ImageWithBenefitsSchema,
    benefitsTextSoftCTA: BenefitsTextSoftCTASchema,
    imageReview: ImageReviewSchema,
    manualsLinks: ManualsLinksSchema,
    specTable: SpecTableSchema,
    comparisonTable: ComparisonTableSchema,
    faq: FAQSchema,
    gallery: GallerySchema,
    shippingReturns: ShippingReturnsSchema,
    warrantyCompliance: WarrantyComplianceSchema,
    text: TextFallbackSchema,
  };

  return schemas[type] || TextFallbackSchema;
}

export default {
  SectionType,
  SectionPlanSchema,
  SectionPlanArraySchema,
  IntroSummarySchema,
  ImageWithBenefitsSchema,
  BenefitsTextSoftCTASchema,
  ImageReviewSchema,
  ManualsLinksSchema,
  SpecTableSchema,
  ComparisonTableSchema,
  FAQSchema,
  GallerySchema,
  ShippingReturnsSchema,
  WarrantyComplianceSchema,
  TextFallbackSchema,
  MediaAssignmentSchema,
  ValidationResultSchema,
  getSchemaForType,
};
