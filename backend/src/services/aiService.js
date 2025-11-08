import OpenAI from 'openai';

/**
 * AI Service
 * Handles OpenAI integration with example-based learning
 */

let openai;

function getOpenAIClient() {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

/**
 * Generate content using OpenAI with examples
 * Learns from provided examples to generate similar content
 */
export const generateContent = async (prompt, sectionType, examples = [], options = {}) => {
  try {
    // Build system prompt with examples
    let systemPrompt = buildSystemPrompt(sectionType, examples, options);

    // Make API call
    const completion = await getOpenAIClient().chat.completions.create({
      model: options.model || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 500,
    });

    return {
      success: true,
      content: completion.choices[0].message.content,
      usage: {
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens,
      },
    };
  } catch (error) {
    console.error('AI Service Error:', error.message);
    throw {
      code: 'AI_ERROR',
      message: error.message || 'Failed to generate content',
    };
  }
};

/**
 * Build system prompt with examples for better learning
 */
function buildSystemPrompt(sectionType, examples = [], options = {}) {
  let prompt = '';

  // Section-specific instructions
  switch (sectionType) {
    case 'hero':
      prompt = `You are an expert copywriter specializing in creating compelling hero sections for product pages.
Your task is to generate engaging, persuasive hero titles and subtitles that grab attention and convey the product's unique value.

Guidelines:
- Hero titles should be concise (5-8 words) and benefit-focused
- Subtitles should expand on the benefit and create urgency or desire
- Use power words: innovative, revolutionary, ultimate, exclusive, proven, etc.
- Consider the target audience and product category
- Make it memorable and emotionally resonant`;
      break;

    case 'text':
      prompt = `You are an expert content writer specializing in product descriptions and marketing copy.
Generate clear, persuasive text content that educates and convinces readers.

Guidelines:
- Start with the most important benefit
- Use simple, conversational language
- Include specific details and features
- Address customer pain points
- End with a clear call-to-action or benefit statement
- Optimize for readability with short paragraphs`;
      break;

    case 'features':
      prompt = `You are an expert at highlighting product features and benefits.
Generate clear, impactful feature descriptions that convert readers to buyers.

Guidelines:
- Each feature should answer "Why should I care?"
- Use action verbs (reduces, saves, enables, increases, etc.)
- Be specific with numbers and results when possible
- Keep each feature to 1-2 sentences
- Focus on benefits, not just technical specs
- Use power words that resonate with the target audience`;
      break;

    case 'cta':
      prompt = `You are an expert in conversion optimization and persuasive copywriting.
Create compelling call-to-action buttons and accompanying copy that drive conversions.

Guidelines:
- Button text should be action-oriented and specific
- Use power verbs: Get, Discover, Unlock, Start, Claim, etc.
- Copy should create urgency (limited time, exclusive, etc.)
- Address objections or barriers
- Make the benefit clear
- Use FOMO (fear of missing out) when appropriate`;
      break;

    case 'testimonial':
      prompt = `You are an expert in social proof and credibility building.
Generate authentic-sounding customer testimonials and reviews.

Guidelines:
- Include specific details about the product benefit
- Use genuine-sounding language (not overly polished)
- Include a real-sounding name and optional role/company
- Quantify results when possible (saved X hours, improved Y%)
- Focus on transformation or problem solved
- Keep it concise (1-3 sentences)`;
      break;

    case 'comparison':
      prompt = `You are an expert at creating compelling product comparisons.
Generate comparison content that positions your product as the superior choice.

Guidelines:
- Be factual and honest in comparisons
- Highlight key differentiators
- Use your strengths to address competitors' weaknesses
- Include specific metrics when available
- Structure clearly: Feature | Your Product | Alternative
- Use language that shows your advantage`;
      break;

    case 'gallery':
      prompt = `You are an expert at describing product images and visual content.
Generate compelling descriptions for product images and galleries.

Guidelines:
- Describe the image content briefly
- Highlight relevant product details visible in the image
- Use engaging language that draws attention
- Include relevant product benefits shown in the image
- Keep descriptions concise (1-2 sentences)`;
      break;

    default:
      prompt = `You are a helpful assistant specializing in product marketing and copywriting.
Generate high-quality marketing content that engages and converts.`;
  }

  // Add examples if provided
  if (examples && examples.length > 0) {
    prompt += '\n\nExamples of good content in this category:\n\n';
    examples.forEach((example, index) => {
      prompt += `Example ${index + 1}:\n`;
      prompt += `- Input: ${example.input || 'N/A'}\n`;
      prompt += `- Output: ${example.output || 'N/A'}\n`;
      if (example.note) {
        prompt += `- Note: ${example.note}\n`;
      }
      prompt += '\n';
    });

    prompt += 'Generate content following the style and approach shown in these examples.\n';
  }

  return prompt;
}

/**
 * Generate multiple variations
 * Useful for A/B testing
 */
export const generateVariations = async (
  prompt,
  sectionType,
  count = 3,
  examples = [],
  options = {}
) => {
  try {
    const variations = [];

    for (let i = 0; i < count; i++) {
      const result = await generateContent(prompt, sectionType, examples, {
        ...options,
        temperature: options.temperature || 0.8, // Higher temperature for variation
      });

      variations.push({
        id: `variation-${i + 1}`,
        content: result.content,
        index: i + 1,
      });

      // Small delay to avoid rate limiting
      if (i < count - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    return {
      success: true,
      variations,
      totalCount: count,
    };
  } catch (error) {
    console.error('Generate Variations Error:', error);
    throw {
      code: 'VARIATION_ERROR',
      message: 'Failed to generate content variations',
    };
  }
};

/**
 * Analyze and score content
 * Rate generated content for quality
 */
export const scoreContent = async (content, sectionType, criteria = []) => {
  try {
    const scoringPrompt = buildScoringPrompt(sectionType, criteria);

    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: scoringPrompt,
        },
        {
          role: 'user',
          content: `Please score this ${sectionType} content:\n\n${content}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    // Parse the response
    const scoreText = completion.choices[0].message.content;
    const scores = parseScores(scoreText);

    return {
      success: true,
      content,
      sectionType,
      scores,
      feedback: scoreText,
    };
  } catch (error) {
    console.error('Score Content Error:', error);
    throw {
      code: 'SCORE_ERROR',
      message: 'Failed to score content',
    };
  }
};

/**
 * Build scoring prompt
 */
function buildScoringPrompt(sectionType, criteria = []) {
  let prompt = `You are an expert marketing copywriter and content analyst.
Score the following ${sectionType} content on a scale of 1-10 for each criterion.

Default scoring criteria:
- Clarity: Is the message clear and easy to understand?
- Persuasiveness: Does it convince and motivate action?
- Relevance: Is it appropriate for the section type?
- Engagement: Does it capture attention and interest?
- Tone: Is the tone appropriate for the product/audience?

`;

  if (criteria.length > 0) {
    prompt += `Custom criteria:\n${criteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n`;
  }

  prompt += `\nProvide scores in the following format:
Criterion: Score (explanation)

Then provide an overall score and key recommendations.`;

  return prompt;
}

/**
 * Parse scores from AI response
 */
function parseScores(scoreText) {
  const scores = {};
  const lines = scoreText.split('\n');

  lines.forEach((line) => {
    if (line.includes(':') && line.match(/\d/)) {
      const [criterion, scoreStr] = line.split(':');
      const match = scoreStr.match(/\d+/);
      if (match) {
        scores[criterion.trim()] = parseInt(match[0]);
      }
    }
  });

  return scores;
}

/**
 * Refine content based on feedback
 */
export const refineContent = async (
  originalContent,
  feedback,
  sectionType,
  examples = [],
  options = {}
) => {
  try {
    const refinementPrompt = `You are revising the following ${sectionType} content based on feedback.

Original content:
${originalContent}

Feedback to address:
${feedback}

Please revise the content to address the feedback while maintaining the core message. Return only the revised content.`;

    const result = await generateContent(refinementPrompt, sectionType, examples, options);

    return {
      success: true,
      originalContent,
      refinedContent: result.content,
      feedback,
    };
  } catch (error) {
    console.error('Refine Content Error:', error);
    throw {
      code: 'REFINE_ERROR',
      message: 'Failed to refine content',
    };
  }
};

/**
 * Generate secondary keywords from product title
 * Used for SEO optimization and heading variation
 */
export const generateSecondaryKeywords = async (productTitle) => {
  try {
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    const prompt = `Given the product title: "${productTitle}"

Generate 4-6 secondary keywords that:
1. Are natural variations or related keywords to the main product
2. Combine brand names, product types, and key features
3. Include both generic and specific variations
4. Are SEO-friendly and commonly searched
5. Can be used as headings throughout a product description

EXAMPLE:
Product Title: Duramax SideMate Shed with Foundation 4'x8' - 06625
Secondary Keywords: Sidemate Shed, Duramax Shed, Sidemate Backyard Shed, Sidemate 4x8 Shed, duramax sidemate storage shed, 4x8 duramax shed

Return only the keywords as a comma-separated list, nothing else.`;

    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an SEO expert and copywriter. Generate keyword variations from product titles by combining brand names, product types, and key specifications. Follow the pattern shown in examples.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    // Parse the response into an array
    const keywordString = completion.choices[0].message.content.trim();
    const keywords = keywordString.split(',').map((k) => k.trim());

    return {
      success: true,
      keywords,
      usage: {
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens,
      },
    };
  } catch (error) {
    console.error('Generate Secondary Keywords Error:', error);
    throw {
      code: 'KEYWORD_ERROR',
      message: error.message || 'Failed to generate secondary keywords',
      details: error.error?.message || error.message,
    };
  }
};

/**
 * Build stage-specific system prompt for product description
 * Includes examples and quality checklist for each stage
 */

/**
 * Plan optimal sections for product page
 * Analyzes product data and determines which sections to generate (2-8 sections)
 */
export const planSections = async (productContext, mediaInventory = {}) => {
  try {
    const systemPrompt = `You are an e-commerce product page section planner.

GOAL
Return an ordered list of numbered sections (Section 1, Section 2, …). Each section has:
- type (from the allowed set)
- goal (why this section exists)
- source_refs (what inputs it uses)
- min_required_fields (what the renderer needs)
- constraints (count/format limits)
- confidence (0–1)
- notes (issues/todos/split/merge rationale)

ALLOWED SECTION TYPES
"hero"                      // hero title + subtitle for product intro
"text"                      // rich text content block
"features"                  // feature list with descriptions
"image"                     // single image section
"gallery"                   // image gallery
"cta"                       // call-to-action button
"testimonial"               // customer testimonial/review
"comparison"                // comparison table
"twoColumn"                 // two-column layout with image and text
"sideBySide"                // side-by-side layout with images
"threeColumns"              // three-column layout
"fourColumns"               // four-column layout
"twoColumnHighlight"        // two-column with rich text and media

RULES (split/merge/ordering)
1) Don't use "stages". Produce Section 1..N in narrative order.
2) Section 1 SHOULD be "hero" with compelling title and subtitle. If inputs are too weak, use "text".
3) Prefer this baseline flow when inputs allow:
   1) hero            - attention-grabbing title and subtitle
   2) features        - key features with descriptions
   3) text            - detailed benefits and value proposition
   4) testimonial     - customer reviews/testimonials (if customer quotes exist)
   5) gallery         - product images (if multiple images available)
   6) comparison      - comparison table (if specs exist)
   7) cta             - call-to-action button
   Optional: image, twoColumn, sideBySide, threeColumns, fourColumns, twoColumnHighlight
4) Split a concept into multiple sections when any item count >8, or themes are distinct.
5) Merge adjacent lightweight plans (<3 bullets/rows each) to stay within section limits.
6) Never introduce multiple hard CTA sections; one strong call-to-action at the end is appropriate.
7) If a required input is missing for a section type, OMIT that section.
8) Min sections = 2, Max sections = 8. Prioritize most important content if product data would generate more than 8 sections.

OUTPUT (STRICT JSON)
{
  "sections": [
    {
      "index": 1,
      "type": "hero",
      "goal": "Compelling product introduction with title and subtitle",
      "source_refs": ["title", "key_benefits"],
      "min_required_fields": ["title","subtitle"],
      "constraints": {
        "title_max_words": 8,
        "subtitle_max_words": 15
      },
      "confidence": 0.95,
      "notes": { "issues":[], "todos":[], "split_reason":null, "merge_reason":null }
    }
  ]
}

VALIDATION CHECKS
- First section must not require external media to make sense (hero or text work best).
- Use features section for product specifications and features.
- Use comparison section only if multiple metrics/specs exist.
- Use gallery section only if multiple images are available.
- Use testimonial section only if customer quotes/reviews are provided.

Return ONLY JSON.`;

    const userPrompt = `Product Context:
${JSON.stringify(productContext, null, 2)}

Media Inventory:
${JSON.stringify(mediaInventory, null, 2)}

Plan the optimal section order for this product page.`;

    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3, // Lower temperature for structured planning
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const planResult = JSON.parse(completion.choices[0].message.content);

    return {
      success: true,
      sections: planResult.sections || [],
      usage: {
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens,
      },
    };
  } catch (error) {
    console.error('Plan Sections Error:', error);
    throw {
      code: 'PLAN_ERROR',
      message: error.message || 'Failed to plan sections',
    };
  }
};

/**
 * Build type-specific realizer prompt
 */
function buildSectionRealizerPrompt(sectionType) {
  const sharedStyle = `SHARED STYLE
- Concise, factual, brand-safe. No hype.
- Use Title Case for headings (≤ 8 words).
- If bullets: 4–6 items, 5–12 words each, factual.
- If soft CTA (benefitsTextSoftCTA only): end final paragraph with a single, natural purchase nudge (no button).`;

  const typePrompts = {
    hero: `${sharedStyle}

TYPE: hero
{
  "title": "Compelling 5-8 word headline focused on main benefit",
  "subtitle": "10-15 word value proposition explaining what makes this unique"
}`,

    text: `${sharedStyle}

TYPE: text (rich text HTML content)
{
  "text": "<h2>Heading</h2><p>Detailed benefits and value proposition (100-200 words). Can include <strong>bold</strong> and <em>italic</em> formatting.</p>"
}`,

    features: `${sharedStyle}

TYPE: features
{
  "features": [
    {
      "title": "Feature Name (5-8 words)",
      "description": "10-20 word benefit explanation",
      "icon": null
    }
  ] // 3-6 features
}`,

    image: `${sharedStyle}

TYPE: image (single image section)
{
  "altText": "Descriptive alt text for accessibility (6-14 words)"
}`,

    gallery: `${sharedStyle}

TYPE: gallery
{
  "media": [
    {
      "url": null,
      "altText": "Descriptive alt text"
    }
  ] // 3-8 images
}`,

    cta: `${sharedStyle}

TYPE: cta (call-to-action)
{
  "buttonText": "Action verb + benefit (3-4 words)",
  "buttonLink": "#"
}`,

    testimonial: `${sharedStyle}

TYPE: testimonial
{
  "testimonials": [
    {
      "quote": "Customer review (1-3 sentences)",
      "author": "Customer Name",
      "authorTitle": "Optional title/company",
      "photo": null
    }
  ] // 1-4 testimonials
}`,

    comparison: `${sharedStyle}

TYPE: comparison
{
  "table": {
    "headers": ["Feature", "This Product", "Alternative"],
    "rows": [
      ["Feature Name", "Advantage", "Competitor Value"]
    ]
  } // 3-6 rows
}`,

    twoColumn: `${sharedStyle}

TYPE: twoColumn
{
  "leftText": "Text content for left column (50-100 words)",
  "rightImage": null
}`,

    sideBySide: `${sharedStyle}

TYPE: sideBySide
{
  "col1Text": "Column 1 description (30-50 words)",
  "col2Text": "Column 2 description (30-50 words)",
  "col1Image": null,
  "col2Image": null
}`,

    threeColumns: `${sharedStyle}

TYPE: threeColumns
{
  "col1Text": "Column 1 text",
  "col2Text": "Column 2 text",
  "col3Text": "Column 3 text",
  "col1Image": null,
  "col2Image": null,
  "col3Image": null
}`,

    fourColumns: `${sharedStyle}

TYPE: fourColumns
{
  "col1Text": "Text",
  "col2Text": "Text",
  "col3Text": "Text",
  "col4Text": "Text",
  "col1Image": null,
  "col2Image": null,
  "col3Image": null,
  "col4Image": null
}`,

    twoColumnHighlight: `${sharedStyle}

TYPE: twoColumnHighlight
{
  "richText": "<h2>Heading</h2><p>Detailed content with formatting</p>",
  "mediaUrl": null,
  "mediaType": "image"
}`,
  };

  return typePrompts[sectionType] || typePrompts.text;
}

/**
 * Generate content for a single section
 */
export const realizeSection = async (sectionPlan, productContext) => {
  try {
    const systemPrompt = `You are a content realizer. You receive a section plan and the product_context. Output only the content object for that section type.

${buildSectionRealizerPrompt(sectionPlan.type)}

OUTPUT
Return ONLY the JSON object for the section type. No commentary.`;

    const userPrompt = `Section Plan:
${JSON.stringify(sectionPlan, null, 2)}

Product Context:
${JSON.stringify(productContext, null, 2)}

Generate the content for this section.`;

    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
      response_format: { type: 'json_object' },
    });

    const content = JSON.parse(completion.choices[0].message.content);

    return {
      success: true,
      sectionIndex: sectionPlan.index,
      type: sectionPlan.type,
      content,
      usage: {
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens,
      },
    };
  } catch (error) {
    console.error('Realize Section Error:', error);
    throw {
      code: 'REALIZE_ERROR',
      message: error.message || 'Failed to realize section',
    };
  }
};

/**
 * Assign media to a section
 */
export const assignMedia = async (sectionPlan, sectionContent, mediaInventory) => {
  try {
    const systemPrompt = `You select the best media for ONE section and write alt text.

RULES
- Priority alignment by type:
  - introSummary: one hero image (16:9 or 3:2), no video.
  - imageWithBenefits: 1 strong landscape image; avoid heavy text overlays.
  - imageReview: must use a customer image if provided via reviews[].image_id; else return null and a TODO.
  - manualsLinks/specTable: no images unless a true diagram (tags include ["diagram","dimensions","callouts"]).
  - benefitsTextSoftCTA: optional 1 lifestyle image; skip if none suitable.
- Choose images with qualityScore ≥ 0.75 when possible; break ties by aspect ratio suitability then by tag match.
- Alt text: 6–14 words, literal, no promo language. Mention brand/model only if visible/salient.

OUTPUT (STRICT JSON)
{
  "section_index": <number>,
  "image_id": "img_123" | null,
  "video_id": null,
  "alt_text": { "img_123": "Duramax 4x8 vinyl shed beside house wall" },
  "rationale": "why selected or why null",
  "todos": ["need lifestyle 16:9 image"]
}
Return ONLY JSON.`;

    const userPrompt = `Section Plan:
${JSON.stringify(sectionPlan, null, 2)}

Section Content:
${JSON.stringify(sectionContent, null, 2)}

Media Inventory:
${JSON.stringify(mediaInventory, null, 2)}

Select the best media for this section.`;

    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 300,
      response_format: { type: 'json_object' },
    });

    const assignment = JSON.parse(completion.choices[0].message.content);

    return {
      success: true,
      assignment,
      usage: {
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens,
      },
    };
  } catch (error) {
    console.error('Assign Media Error:', error);
    throw {
      code: 'MEDIA_ERROR',
      message: error.message || 'Failed to assign media',
    };
  }
};

/**
 * Validate section content
 */
export const validateSection = async (sectionPlan, sectionContent) => {
  try {
    const systemPrompt = `Validate a section content object against its plan:
- Ensure required fields in plan.min_required_fields are present and non-empty.
- For bullets, enforce 4–6 items when applicable (trim or request TODO in notes).
- For specTable:
  - If fewer than 5 normalized specs → set mode="list" and move rows into listItems.
  - Normalize units (prefer inches); if mixed units detected, add "unit_notes".
- If validation fails and cannot be auto-fixed → replace with type "text" fallback and include a TODO list.

Return STRICT JSON:
{ "valid": true|false, "fixed": <object or null>, "reasons": ["..."] }`;

    const userPrompt = `Section Plan:
${JSON.stringify(sectionPlan, null, 2)}

Section Content:
${JSON.stringify(sectionContent, null, 2)}

Validate and fix if needed.`;

    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    });

    const validation = JSON.parse(completion.choices[0].message.content);

    return {
      success: true,
      validation,
      usage: {
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens,
      },
    };
  } catch (error) {
    console.error('Validate Section Error:', error);
    throw {
      code: 'VALIDATION_ERROR',
      message: error.message || 'Failed to validate section',
    };
  }
};

export default {
  generateContent,
  generateVariations,
  scoreContent,
  refineContent,
  generateSecondaryKeywords,
  // Section Builder Framework methods
  planSections,
  realizeSection,
  assignMedia,
  validateSection,
};
