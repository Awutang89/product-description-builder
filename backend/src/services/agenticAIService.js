import { getOpenAIClient } from '../config/openai.js';

/**
 * Agentic AI Service - Multi-stage Product Description Generation
 * Implements 5-stage workflow with self-critique and human feedback loops
 */

/**
 * Stage 1: Problem Identification
 * Analyzes product and suggests potential problems it solves
 */
export const generateProblemIdentification = async (productTitle, supplierDescription) => {
  const systemPrompt = `You are an expert product copywriter analyzing products to identify customer problems they solve.

Your task: Analyze the product and identify 2-3 potential problems this product solves for customers.

GUIDELINES:
- Think about the customer avatar (who uses this?)
- What pain point or need does this address?
- Be specific, not generic
- Consider both functional and emotional benefits

EXAMPLES:
✓ "Workshop enthusiast needs organized tool storage in new garage"
✓ "Family needs outdoor heating solution for year-round patio gatherings"
✓ "Individual with chemical sensitivities needs pure air filtration"
✓ "Homeowner needs secure outdoor storage for equipment and tools"

OUTPUT FORMAT (strict JSON):
{
  "suggestions": [
    {
      "problem": "Clear problem statement",
      "avatar": "Customer type who has this problem",
      "why": "Brief explanation of why this product solves it"
    }
  ],
  "recommended_index": 0
}`;

  const userPrompt = `Product Title: ${productTitle}

Supplier Description:
${supplierDescription}

Analyze this product and suggest 2-3 problems it solves.`;

  const completion = await getOpenAIClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 600,
    response_format: { type: 'json_object' },
  });

  const result = JSON.parse(completion.choices[0].message.content);

  return {
    success: true,
    suggestions: result.suggestions || [],
    recommended: result.recommended_index || 0,
    usage: {
      promptTokens: completion.usage.prompt_tokens,
      completionTokens: completion.usage.completion_tokens,
      totalTokens: completion.usage.total_tokens,
    },
  };
};

/**
 * Stage 2: Solution Explanation
 * Explains HOW the product solves the identified problem
 */
export const generateSolutionExplanation = async (
  productTitle,
  supplierDescription,
  problemStatement,
  customerAvatar,
  secondaryKeywords
) => {
  const systemPrompt = `You are an expert product copywriter creating solution explanations.

Your task: Explain HOW this product solves the customer's problem.

GUIDELINES:
- Use features from the supplier description to explain the solution
- Make it clear and logical
- Focus on mechanism (how it works)
- Use 1 secondary keyword in this section naturally
- Write 2-3 paragraphs (150-250 words)
- Customer-focused language (not technical jargon)

OUTPUT FORMAT (strict JSON):
{
  "content": "<h2>How {Product with Keyword} Solves {Problem}</h2><p>Paragraph explaining solution mechanism...</p><p>Additional details...</p>",
  "keyword_used": "Which secondary keyword was used"
}`;

  const userPrompt = `Product: ${productTitle}

Problem: ${problemStatement}
Customer Avatar: ${customerAvatar}
Secondary Keywords: ${secondaryKeywords.join(', ')}

Supplier Description:
${supplierDescription}

Explain how this product solves the problem.`;

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

  const result = JSON.parse(completion.choices[0].message.content);

  return {
    success: true,
    content: result.content || '',
    keywordUsed: result.keyword_used || '',
    usage: {
      promptTokens: completion.usage.prompt_tokens,
      completionTokens: completion.usage.completion_tokens,
      totalTokens: completion.usage.total_tokens,
    },
  };
};

/**
 * Stage 3: Features to Benefits Mapping
 * Converts each product feature into a customer benefit
 */
export const generateFeatureBenefits = async (
  productTitle,
  supplierDescription,
  problemStatement,
  secondaryKeywords
) => {
  const systemPrompt = `You are an expert at converting product features into customer benefits.

Your task: Extract features and write benefit statements for EACH feature.

FEATURE → BENEFIT FORMAT:
"{Feature Title}: {What this means for the customer and how it helps solve their problem}"

EXAMPLE:
✓ "360° Perforated Steel Intake: Drawing air into all sides of the purifier, it then passes through the four-stage filtration process. With a high-velocity airflow, it can create a pocket of clean air around you."

GUIDELINES:
- Extract 4-8 key features from supplier description
- Each feature MUST have a benefit statement
- Benefits should connect back to solving the problem
- Use 2-3 secondary keywords across feature titles
- Make benefits specific and tangible (not vague)

OUTPUT FORMAT (strict JSON):
{
  "features": [
    {
      "title": "Feature Name with Keyword",
      "benefit": "Customer benefit explanation (1-2 sentences)",
      "has_keyword": true/false
    }
  ]
}`;

  const userPrompt = `Product: ${productTitle}

Problem We're Solving: ${problemStatement}
Secondary Keywords: ${secondaryKeywords.join(', ')}

Supplier Description:
${supplierDescription}

Extract features and write benefit statements.`;

  const completion = await getOpenAIClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 1200,
    response_format: { type: 'json_object' },
  });

  const result = JSON.parse(completion.choices[0].message.content);

  return {
    success: true,
    features: result.features || [],
    usage: {
      promptTokens: completion.usage.prompt_tokens,
      completionTokens: completion.usage.completion_tokens,
      totalTokens: completion.usage.total_tokens,
    },
  };
};

/**
 * Stage 4: Technical Specifications
 * Explains technical specs and how they contribute to solving the problem
 */
export const generateTechnicalSpecs = async (
  productTitle,
  supplierDescription,
  problemStatement,
  secondaryKeywords
) => {
  const systemPrompt = `You are an expert at explaining technical specifications in customer-friendly terms.

Your task: Extract specs and explain how each contributes to solving the problem.

GUIDELINES:
- Create a spec table if multiple specifications exist
- Add explanatory text connecting specs to problem-solution
- Use 1 secondary keyword in heading
- If specs are minimal, focus on explaining what's provided
- Make technical details accessible

OUTPUT FORMAT (strict JSON):
{
  "has_table": true/false,
  "table": {
    "headers": ["Specification", "Value", "Benefit"],
    "rows": [
      ["Spec Name", "Value", "How this helps"]
    ]
  },
  "explanatory_text": "<h2>Technical Specs of {Product with Keyword}</h2><p>Paragraph explaining how specs solve problem...</p>",
  "keyword_used": "Which keyword was used"
}`;

  const userPrompt = `Product: ${productTitle}

Problem We're Solving: ${problemStatement}
Secondary Keywords: ${secondaryKeywords.join(', ')}

Supplier Description:
${supplierDescription}

Extract and explain technical specifications.`;

  const completion = await getOpenAIClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 1000,
    response_format: { type: 'json_object' },
  });

  const result = JSON.parse(completion.choices[0].message.content);

  return {
    success: true,
    hasTable: result.has_table || false,
    table: result.table || null,
    explanatoryText: result.explanatory_text || '',
    keywordUsed: result.keyword_used || '',
    usage: {
      promptTokens: completion.usage.prompt_tokens,
      completionTokens: completion.usage.completion_tokens,
      totalTokens: completion.usage.total_tokens,
    },
  };
};

/**
 * Stage 5: Conclusion + CTA
 * Creates compelling conclusion with call-to-action
 */
export const generateConclusion = async (
  productTitle,
  problemStatement,
  keyBenefits
) => {
  const systemPrompt = `You are an expert at writing compelling product conclusions with strong CTAs.

Your task: Write a conclusion that summarizes benefits and encourages purchase.

GUIDELINES:
- Reinforce the problem → solution narrative
- Highlight 2-3 key benefits
- Include the main product keyword (full title) once
- Strong call-to-action to purchase
- 1-2 paragraphs (100-150 words)
- Create urgency or confidence in the solution

OUTPUT FORMAT (strict JSON):
{
  "content": "<h2>Get Your {Product Title} Today</h2><p>Conclusion paragraph reinforcing benefits...</p><p>Strong CTA paragraph...</p>",
  "cta_button_text": "Suggested button text (3-4 words)"
}`;

  const userPrompt = `Product: ${productTitle}

Problem Solved: ${problemStatement}

Key Benefits:
${keyBenefits.map((b, i) => `${i + 1}. ${b}`).join('\n')}

Write a compelling conclusion with CTA.`;

  const completion = await getOpenAIClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 500,
    response_format: { type: 'json_object' },
  });

  const result = JSON.parse(completion.choices[0].message.content);

  return {
    success: true,
    content: result.content || '',
    ctaButtonText: result.cta_button_text || 'Shop Now',
    usage: {
      promptTokens: completion.usage.prompt_tokens,
      completionTokens: completion.usage.completion_tokens,
      totalTokens: completion.usage.total_tokens,
    },
  };
};

/**
 * Self-Critique Function
 * AI evaluates its own generated content and suggests improvements
 */
export const critiqueStageContent = async (stageNumber, stageContent, checklistItems) => {
  const systemPrompt = `You are an expert content critic evaluating product description quality.

Your task: Review the generated content and provide honest, constructive critique.

EVALUATION CRITERIA:
${checklistItems.map((item) => `- ${item}`).join('\n')}

GUIDELINES:
- Be honest about issues found
- Suggest specific improvements
- Note what's working well
- Rate overall quality (1-5 stars)
- Decide if content is "ready" or "needs revision"

OUTPUT FORMAT (strict JSON):
{
  "overall_rating": 4,
  "status": "ready" or "needs_revision",
  "strengths": ["What's working well"],
  "issues": ["Specific problems found"],
  "suggestions": ["Concrete improvements to make"],
  "checklist_results": {
    "keyword_included": true/false,
    "benefits_clear": true/false,
    "addresses_problem": true/false,
    "natural_language": true/false
  }
}`;

  const userPrompt = `Stage ${stageNumber} Content:
${stageContent}

Evaluate this content against the criteria.`;

  const completion = await getOpenAIClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3, // Lower temp for consistent evaluation
    max_tokens: 600,
    response_format: { type: 'json_object' },
  });

  const result = JSON.parse(completion.choices[0].message.content);

  return {
    success: true,
    rating: result.overall_rating || 3,
    status: result.status || 'ready',
    strengths: result.strengths || [],
    issues: result.issues || [],
    suggestions: result.suggestions || [],
    checklistResults: result.checklist_results || {},
    usage: {
      promptTokens: completion.usage.prompt_tokens,
      completionTokens: completion.usage.completion_tokens,
      totalTokens: completion.usage.total_tokens,
    },
  };
};

/**
 * Evaluation 1: Alt Text Quality
 * Checks if images have proper alt text with keywords
 */
export const evaluateAltTextQuality = async (sections, secondaryKeywords) => {
  const systemPrompt = `You are an expert SEO and accessibility evaluator checking alt text quality.

Your task: Evaluate all images in the generated sections for alt text quality.

CRITERIA:
1. Every image must have alt text
2. Alt text must include at least one secondary keyword
3. Alt text must describe what the image shows
4. Format should be: "{keyword} - {description}"

EXAMPLES OF GOOD ALT TEXT:
✓ "HealthMate Plus Air Purifier - HEPA filtration system removing airborne particles"
✓ "Austin Air Purifier - 360-degree air intake design"

EXAMPLES OF BAD ALT TEXT:
✗ "Product image" (no keyword, not descriptive)
✗ "air purifier" (no keyword variation, too generic)
✗ "" (missing alt text)

OUTPUT FORMAT (strict JSON):
{
  "overall_score": 4.5,
  "total_images": 5,
  "images_with_alt": 5,
  "images_with_keyword": 4,
  "issues": [
    {
      "section_index": 2,
      "field": "rightImage",
      "problem": "Alt text missing secondary keyword",
      "current_alt": "Product sitting on table",
      "suggested_alt": "HealthMate Plus Purifier - Product on table in home setting"
    }
  ],
  "passed": true/false,
  "summary": "Brief evaluation summary"
}`;

  const userPrompt = `Secondary Keywords Available: ${secondaryKeywords.join(', ')}

Sections to Evaluate:
${JSON.stringify(sections, null, 2)}

Evaluate all images for alt text quality.`;

  const completion = await getOpenAIClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 1000,
    response_format: { type: 'json_object' },
  });

  const result = JSON.parse(completion.choices[0].message.content);

  return {
    success: true,
    score: result.overall_score || 0,
    totalImages: result.total_images || 0,
    imagesWithAlt: result.images_with_alt || 0,
    imagesWithKeyword: result.images_with_keyword || 0,
    issues: result.issues || [],
    passed: result.passed || false,
    summary: result.summary || '',
    usage: {
      promptTokens: completion.usage.prompt_tokens,
      completionTokens: completion.usage.completion_tokens,
      totalTokens: completion.usage.total_tokens,
    },
  };
};

/**
 * Evaluation 2: Keyword Coverage
 * Checks if H2 headings include secondary keywords and distribution is natural
 */
export const evaluateKeywordCoverage = async (sections, secondaryKeywords, mainKeyword) => {
  const systemPrompt = `You are an expert SEO evaluator checking keyword usage in content.

Your task: Evaluate keyword coverage in H2 headings and overall content.

CRITERIA:
1. Every H2 heading must include at least one secondary keyword
2. Keywords should be naturally distributed (not stuffed)
3. Minimum 1 keyword usage per section
4. Keywords should vary (not repeating the exact same phrase)
5. Main product keyword should appear in conclusion

EXAMPLES OF GOOD KEYWORD USAGE:
✓ "<h2>How the HealthMate Plus Purifier Cleans Your Air</h2>" (natural integration)
✓ "<h2>Key Features of the Austin Air System</h2>" (keyword variation)

EXAMPLES OF BAD KEYWORD USAGE:
✗ "<h2>Features</h2>" (no keyword)
✗ "<h2>Austin Air HealthMate Plus Air Purifier Best Austin Air HealthMate Plus</h2>" (stuffing)

OUTPUT FORMAT (strict JSON):
{
  "overall_score": 4.2,
  "total_h2_headings": 6,
  "headings_with_keywords": 5,
  "keyword_distribution": {
    "HealthMate Plus Air": 2,
    "Austin Air Purifier": 2,
    "HealthMate Plus Purifier": 1
  },
  "issues": [
    {
      "section_index": 1,
      "heading": "<h2>Product Benefits</h2>",
      "problem": "Missing secondary keyword in H2 heading",
      "suggested_heading": "<h2>HealthMate Plus Air Benefits</h2>"
    }
  ],
  "keyword_stuffing_detected": false,
  "main_keyword_in_conclusion": true,
  "passed": true/false,
  "summary": "Brief evaluation summary"
}`;

  const userPrompt = `Main Product Keyword: ${mainKeyword}

Secondary Keywords Available: ${secondaryKeywords.join(', ')}

Sections to Evaluate:
${JSON.stringify(sections, null, 2)}

Evaluate keyword coverage and usage quality.`;

  const completion = await getOpenAIClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 1000,
    response_format: { type: 'json_object' },
  });

  const result = JSON.parse(completion.choices[0].message.content);

  return {
    success: true,
    score: result.overall_score || 0,
    totalH2Headings: result.total_h2_headings || 0,
    headingsWithKeywords: result.headings_with_keywords || 0,
    keywordDistribution: result.keyword_distribution || {},
    issues: result.issues || [],
    keywordStuffing: result.keyword_stuffing_detected || false,
    mainKeywordInConclusion: result.main_keyword_in_conclusion || false,
    passed: result.passed || false,
    summary: result.summary || '',
    usage: {
      promptTokens: completion.usage.prompt_tokens,
      completionTokens: completion.usage.completion_tokens,
      totalTokens: completion.usage.total_tokens,
    },
  };
};

export default {
  generateProblemIdentification,
  generateSolutionExplanation,
  generateFeatureBenefits,
  generateTechnicalSpecs,
  generateConclusion,
  critiqueStageContent,
  evaluateAltTextQuality,
  evaluateKeywordCoverage,
};
