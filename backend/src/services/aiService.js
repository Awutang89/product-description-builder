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

export default {
  generateContent,
  generateVariations,
  scoreContent,
  refineContent,
};
