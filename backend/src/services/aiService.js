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
function buildProductDescriptionPrompt(stage, productTitle, secondaryKeywords = []) {
  const keywords = secondaryKeywords.length > 0 ? secondaryKeywords.join(', ') : productTitle;

  const stagePrompts = {
    1: `You are an expert copywriter specializing in identifying and articulating customer problems.

QUALITY CHECKLIST - Your output must meet ALL of these criteria:
✓ Heading incorporates the keyword naturally
✓ NEVER use H1 heading tags (use H2, H3, or H4 only)
✓ Identifies a specific, relatable customer problem (not generic)
✓ Shows deep understanding of customer pain points
✓ Creates empathy - customer feels understood
✓ Validates frustration with emotional language
✓ Sets up product as the logical next step
✓ Uses copywriting to tell a story and create a hook at the beginning
✓ Mentions the primary keyword (product name) at least once in the first 100-300 words
✓ Uses chunking with bullet/numbered lists and increased white space to enhance readability
✓ PRESERVE ALL NUMBERS: Never change specifications, measurements, weights, or dimensions (e.g., "2 windows", "20lbs/sq ft", "18'x20'x30'") - use exactly as provided in product details
✓ AVOID OVERUSED WORDS: Minimize use of clichéd marketing terms like "versatile", "ample", "durable", "durability", "enhance", "utilize", "leverage", "seamless", "unlock", "harness", "synergize", "catalyze", and "blend of" phrases - use fresh, specific language instead
✓ Length: 150-250 words of body content
✓ Tone: Conversational, empathetic, not salesy

EXAMPLE 1 - Stage 1: Problem Identification
Product: Airpura R700 Air Purifier
Secondary Keywords: Airpura R700, R700 Air Purifier, Airpura, R700 Airpura

[HEADING]
Give Your Family the Gift of Clean Air with the Airpura R700

[BODY]
This is the everyday air purifier you've been looking for.

Eliminate unwanted household chemicals, pollen, mold spores, dust, allergens, odors, and more!

With indoor air quality now an environmental health concern, you should know what you are breathing inside your home or at work.

With its powerful 635 CFM Impeller, the R700 is able to draw air through an 18 pound carbon bed and true HEPA filter. This will help clean your indoor environment by removing any potential health hazards that may be present in polluted air!

Help relieve allergy, asthma, or MCS symptoms with one of the best air purifiers on the market.

Can you feel the crispness of your new air yet? Get your Airpura R700 Air Purifier today!

WHY THIS WORKS:
✓ Emotional Hook: Opens with "gift of clean air" in heading - benefit-focused, not feature-focused
✓ Direct & Conversational: "This is the everyday air purifier you've been looking for" - speaks directly to reader
✓ Problem Awareness: Mentions "indoor air quality now an environmental health concern"
✓ Specific Benefits: Lists exact problems it solves (chemicals, pollen, mold, allergens)
✓ Technical Credibility: Includes specs (635 CFM, 18 pound carbon bed) but translates to benefit
✓ Sensory Close: "Can you feel the crispness of your new air yet?" - makes it tangible
✓ Keyword Placement: "Airpura R700" appears in first 100 words

EXAMPLE 2 - Stage 1: Problem Identification
Product: Evaluation Evolution Auto Fold Heavy Duty Power Wheelchair
Secondary Keywords: Evaluation Electric Wheelchair, Evaluation Evolution Fully Automatic Folding Power Wheelchair

[HEADING]
Discover Freedom with the Evaluation Evolution Fully Automatic Folding Power Wheelchair

[BODY]
How often have you felt the burden of dependence, longing for a simpler way to enjoy your day-to-day activities? The Evaluation Evolution Fully Automatic Folding Power Wheelchair is your answer. This isn't just any chair; it's your gateway to reclaiming independence. With its state-of-the-art auto-fold feature, you can easily fold and unfold the chair with just a push of a button, no physical strain, no asking for help. It's compact enough (14" X 31" X 24.5") to fit in any car trunk, making travel a breeze.

WHY THIS WORKS:
✓ Empathy Opening: "How often have you felt the burden of dependence" - acknowledges pain point
✓ Transformation Promise: "gateway to reclaiming independence"
✓ Specific Feature + Benefit: Auto-fold feature → no physical strain, no asking for help
✓ Practical Detail: Exact dimensions (14" X 31" X 24.5") + "fits in any car trunk"
✓ Product Name Early: Mentions full product name in first sentence

EXAMPLE 3 - Stage 1: Problem Identification
Product: Body Solid G9S/G9B Two Stack Gym
Secondary Keywords: Body Solid G9S/G9B All in One Home Gym, Body Solid G9S/G9B Universal Gym

[HEADING]
The Body Solid G9S/G9B All in One Home Gym: The Last Machine You'll Ever Need

[BODY]
How would you like to eliminate monthly fees and daily gym commutes? Maybe you'd prefer to blast your own music, and avoid sweaty gym bros? This multi-station all-in-one gym has 7+ commercial-quality, full-body workout stations in one compact machine. Your busy lifestyle, family, and hobbies, shouldn't suffer to stay in shape. Free up precious time for what matters most with the G9S/G9B.

Commercial quality construction for long-lasting performance.
Powered by two upgradable 210 lb. selectorized weight stacks.
7+ workout stations for legs, chest, back, arms, abs, and more.
An included full function seated leg press with up 520 lbs of resistance.
Premium upholstery, adjustable seats, and durable cables & pulleys.
Front to back, lifetime in-home warranty for a life-time of training.
Lets go a step deeper on this ultimate piece of light commercial home gym equipment.

WHY THIS WORKS:
✓ Lifestyle Hook: "eliminate monthly fees and daily gym commutes"
✓ Personality: "avoid sweaty gym bros" - casual, relatable tone
✓ Value Proposition: "7+ commercial-quality... workout stations in one"
✓ Emotional Benefit: "Your busy lifestyle, family, and hobbies, shouldn't suffer"
✓ Bullet Summary: Quick-scan benefits before diving deep
✓ Conversational Transition: "Lets go a step deeper" - keeps reader engaged
✓ Product Name: "G9S/G9B" appears early in opening paragraph

---

For the product "${productTitle}", create a compelling Stage 1 section that:
1. Identifies the main problem customers face that this product solves
2. Demonstrates deep understanding of the customer's pain points
3. Creates empathy and validates their frustration
4. Sets up the product as the solution
5. Uses the keyword "${keywords}" in a natural heading if possible

Write in a benefit-focused, conversational tone. Include a compelling heading that incorporates the keyword.
Output format: [HEADING]\n[BODY CONTENT]`,

    2: `You are an expert copywriter specializing in solution explanation and value propositions.

QUALITY CHECKLIST - Your output must meet ALL of these criteria:
✓ Heading incorporates the keyword naturally
✓ NEVER use H1 heading tags (use H2, H3, or H4 only)
✓ Explains the core mechanism/how it actually works
✓ Shows before → after transformation clearly
✓ Uses accessible language (no jargon)
✓ Highlights the innovation or unique approach
✓ Addresses the specific problem from Stage 1
✓ Uses chunking with bullet/numbered lists and increased white space to enhance readability
✓ PRESERVE ALL NUMBERS: Never change specifications, measurements, weights, or dimensions (e.g., "635 CFM", "18 pound carbon bed", "2,000 sq ft") - use exactly as provided in product details
✓ AVOID OVERUSED WORDS: Minimize use of clichéd marketing terms like "versatile", "ample", "durable", "durability", "enhance", "utilize", "leverage", "seamless", "unlock", "harness", "synergize", "catalyze", and "blend of" phrases - use fresh, specific language instead
✓ Length: 150-250 words of body content
✓ Tone: Clear, logical, reassuring

EXAMPLE 1 - Stage 2: Solution Explanation
Product: Airpura R700 Air Purifier
Secondary Keywords: R700 Air Purifier, Airpura

[HEADING]
What is New and Improved for the R700 Air Purifier?

[BODY]
New powerful 635 CFM Fan/Motor

The Airpura R700 has the largest motor in a portable air purifier at 635 CFM! CFM stands for cubic feet per minute, and this is how many cubic feet per minute this air purifier can clean. This will give you more complete air exchanges every hour.

Increased Airflow with lower noise levels

Get better performance out of your R700 Air Purifier with the improved airflow. It is also one of the quietest noise levels for an air purifier — 30.2 db on low (a whisper) and 63 db on high (a normal conversation) at 6 ft. Turn it on and let it clean your air without the loud noises.

Purify areas as large as 2,000 sq. ft.

With its multi-stage filtration, the Airpura R700 can help eliminate many pollutants.

These include:

Allergen Particles: Pet dander, dust, dust mites, pollen, mold spores, and asbestos.

WHY THIS WORKS:
✓ Feature → Benefit Translation: Every spec explains "why it matters"
✓ Chunking: Clear subheadings for each feature (H3-style)
✓ Specificity: "635 CFM" + explains what CFM means in layman's terms
✓ Real-World Context: "30.2 db on low (a whisper)" - relatable comparison
✓ Bullet Lists: Uses colons and bullets for allergen types - increases white space
✓ Accessible Language: Technical terms explained immediately (CFM definition)

EXAMPLE 2 - Stage 2: Solution Explanation
Product: Evaluation Evolution Auto Fold Heavy Duty Power Wheelchair
Secondary Keywords: Evaluation Heavy Duty Power Wheelchair Design, Evaluation Folding Wheelchair

[HEADING]
Evaluation Heavy Duty Power Wheelchair Design: Stability Meets Lightweight Agility

[BODY]
Isn't it about time your wheelchair adapted to your needs rather than the other way around? Weighing only 53 lbs yet robust enough to support up to 400 pounds, the Evaluation Evolution combines the best of both worlds: heavy-duty performance in a lightweight, agile frame. Crafted from high-grade aircraft aluminum alloy and equipped with a luxurious leather memory foam seat, it provides comfort without compromising on durability or your mobility.

WHY THIS WORKS:
✓ Rhetorical Question: Engages reader personally
✓ Contrast Strategy: "53 lbs yet... supports up to 400 pounds" - shows engineering achievement
✓ Material Quality Signal: "high-grade aircraft aluminum alloy" builds confidence
✓ Comfort Details: "luxurious leather memory foam seat"
✓ Benefit Summary: "comfort without compromising on durability or your mobility"

EXAMPLE 3 - Stage 2: Solution Explanation
Product: Body Solid G9S/G9B Two Stack Gym
Secondary Keywords: Body Solid G9S/G9B Universal Gym

[HEADING]
The Body Solid G9S/G9B Price Includes Premium Features, Parts Well Rounded Design

[BODY]
The Body Solid Multi Gym G9S/G9B is the top-of-the-line body solid home gym. Providing more than just versatile workouts.

Its built with the user in mind and made to feel like a premium, impressively designed machine that adds value to the user in areas they may not even realize.

Constructed with high durability materials, adjustable seats, selectorized weight stacks, and all the accessories you need to start working out immediately after assembly, so you can make one purchase and be on your way to a healthier longer life of workouts!

Gas Assisted Adjustable Seats
Two Independent 210 lb. Weight Stacks
DuraFirm™ Pads and Upholstery
2,200 lb. Test Strength Cables
Fiberglass Reinforced Nylon Pulleys
11-gauge Steel Construction
Electrostatic Powder Coat Finish
Includes cable attachments and accessories

WHY THIS WORKS:
✓ Quality Focus: "top-of-the-line... premium, impressively designed"
✓ User-Centric: "built with the user in mind"
✓ Complete Solution: "all the accessories you need to start working out immediately"
✓ Scannable List: Feature list after intro paragraph for easy reading
✓ Value Statement: "one purchase... healthier longer life of workouts"

---

For the product "${productTitle}", create a compelling Stage 2 section that:
1. Explains how the product elegantly solves the problem identified in Stage 1
2. Highlights the core mechanism or innovation
3. Shows the transformation from "before" (with problem) to "after" (problem solved)
4. Uses accessible, non-technical language
5. Uses the keyword "${keywords}" in a natural heading if possible

Write in a benefit-focused, conversational tone. Include a compelling heading that incorporates the keyword.
Output format: [HEADING]\n[BODY CONTENT]`,

    3: `You are an expert copywriter specializing in feature-to-benefit translation.

QUALITY CHECKLIST - Your output must meet ALL of these criteria:
✓ Heading incorporates the keyword naturally
✓ NEVER use H1 heading tags (use H2, H3, or H4 only)
✓ Each feature clearly tied to customer benefit
✓ Answers "Why should I care?" for each feature
✓ Uses customer perspective language, not specs
✓ Shows real-world transformation/outcomes
✓ Specific and concrete (not vague)
✓ Uses chunking with bullet/numbered lists and increased white space to enhance readability
✓ PRESERVE ALL NUMBERS: Never change specifications, measurements, weights, or dimensions (e.g., "40 sq ft", "53 lbs", "210 lb weight stacks") - use exactly as provided in product details
✓ AVOID OVERUSED WORDS: Minimize use of clichéd marketing terms like "versatile", "ample", "durable", "durability", "enhance", "utilize", "leverage", "seamless", "unlock", "harness", "synergize", "catalyze", and "blend of" phrases - use fresh, specific language instead
✓ Include lifestyle images where beneficial (reference provided image URLs)
✓ Length: 4-6 feature/benefit pairs with detail
✓ Tone: Conversational, benefit-focused

EXAMPLE 1 - Stage 3: Feature → Benefit Mapping
Product: Airpura R700 Air Purifier
Secondary Keywords: Airpura R700, Airpura

[HEADING]
What Does the Filtration System Look Like Inside the Airpura R700?

[BODY]
The three different filtration stages make sure the air coming out is the purified air you need and want. The stages that make the purified air happen are:

Pre-Filtration: The pre-filter removes large particles and helps to extend the life of the HEPA and carbon filters. This filter should be changed every 12 months and can be vacuumed on the outside of the air purifier.

Carbon Filtration: The unit uses 18 lbs. of activated carbon to collect and absorb chemicals, pollutants, odors, and tobacco smoke from the air. This filter typically lasts up to 2 years.

HEPA Filtration Options: Standard HEPA: The R700 is also equipped with 40 sq. ft. of True HEPA filter material. This filter removes up to 99.97% of airborne particles that are as small as 0.3 microns in diameter. It lasts approximately 3–5 years under regular use. (Option to upgrade to a Super HEPA Filter — R714 — that removes up to 99.99% of airborne particles that are as small as 0.3 microns.)

WHY THIS WORKS:
✓ Educational Tone: Teaches how it works, builds trust
✓ Clear Structure: Three stages clearly separated with labels
✓ Practical Details: Filter lifespan info (12 months, 2 years, 3-5 years)
✓ Transparency: Mentions maintenance requirements honestly
✓ Upgrade Option: Notes Super HEPA upgrade possibility
✓ Specificity: "40 sq. ft. of True HEPA filter material" - concrete details

EXAMPLE 2 - Stage 3: Feature → Benefit Mapping
Product: Evaluation Evolution Auto Fold Heavy Duty Power Wheelchair
Secondary Keywords: Evaluation Auto Fold Electric Wheelchair, Evaluation Electric Wheelchair

[HEADING]
Evaluation Auto Fold Electric Wheelchair: Secure and Empower Your Mobility

[BODY]
Gain the confidence to move safely with features designed to protect and assist you. The Evaluation Evolution's anti-tip wheels prevent backward tipping on inclines, while the load-bearing, flip-up armrests support your weight as you get in and out of the chair. Adjust the joystick from left to right quickly, customizing control to fit your preference, all designed to make your life easier and keep you safe.

Advanced Suspension for Evaluation Electric Folding Wheelchair

Do bumpy paths make you think twice about going out? The Evaluation Evolution ensures that rough terrain is no longer a barrier. Its advanced suspension system with large, shock-absorbent tires provides a smooth ride across various surfaces, letting you explore with confidence and comfort. The four-point coiled springs at each wheel absorb impacts, offering a stability that matches your adventurous spirit.

WHY THIS WORKS:
✓ Safety Focus: Addresses key objection (safety/stability) upfront
✓ Feature List with Purpose: Each safety feature explained with its benefit
✓ Customization: Mentions joystick adjustment - shows adaptability
✓ Objection Handling: "Do bumpy paths make you think twice" - addresses barrier
✓ Freedom Messaging: "rough terrain is no longer a barrier"
✓ Technical + Emotional: Suspension system specs + "adventurous spirit"
✓ Multiple Sections: Two related feature areas combined under same example

EXAMPLE 3 - Stage 3: Feature → Benefit Mapping
Product: Body Solid G9S/G9B Two Stack Gym
Secondary Keywords: Body Solid G9S/G9B, Body Solid G9S/G9B All in One Home Gym

[HEADING]
The Body Solid G9S/G9B Price Includes Premium Features, Parts Well Rounded Design

[BODY]
Gas Assisted Adjustable Seats:
Each adjustable seat post is gas assisted for a smooth, quick adjustment to get the proper body positioning at each station. Discomfort is hard to find on this universal home gym machine.

Two Upgradeable 210 lb. Selectorized Weight Stacks:
Each station is connected to 1 of (2) 210-pound weight stacks shared through the home gym machine. This precisely thought amount of weight will challenge even the strongest home gym users. If you're like Arnold, you can add up to 50 lbs. to each stack, making them 260 lbs. each.

Top grade DuraFirm™ Pads and Upholstery:
Body-Solid made sure to leave nothing out in this complete home gym machine. The DuraFirm padding throughout the machine is high-density, durable foam with a leather substitute upholstery.

2,200 lb. Test Strength Cables:
Tension strength, military spec, and steel aircraft cables with swiveling ends provide durability and low maintenance across the machine. The cables connect everything and can either be weak or strong points in a home gym. For the G9S, it's the latter.

4½" Fiberglass reinforced Nylon Pulleys With Steel Bearings:
The many pulleys on this machine are extra smooth and durable. They're made with fiberglass-reinforced nylon plastic with stainless steel ball bearings inside. This ensures you get that premium feel at each station on the G9S home gym.

11-gauge Steel Construction:
Strong gauge steels ensure a durable and long-lasting home gym machine. Body-Solid is known for its long last equipment because they are "Built for Life", and backed by excellent warranties.

Tough, Durable, Electrostatically Applied Powder Coat Finish:
The attractive paint coating is for more than looks. The powder coating acts as a seal for the steel to fend off moisture and general wear and tear.

All the Accessories you need to work out today:
Revolving lat bar
Revolving straight bar
Ankle strap
Ab crunch / Tricep strap
Total Body Workout™ DVD
Full-size exercise chart
Convenient water bottle and towel holder

WHY THIS WORKS:
✓ Feature List + Deep Dive: Lists features, then explains each in detail with benefits
✓ Benefit Translation: Each spec followed by "why it matters" explanation
✓ Trust Signals: "2,200 lb. Test Strength", "military spec", "Built for Life"
✓ Technical Credibility: Specific measurements and materials build confidence
✓ Complete Package: Shows all included accessories - no hidden costs
✓ Quality Language: "premium feel", "extra smooth and durable" - builds perceived value

---

For the product "${productTitle}", create a compelling Stage 3 section that:
1. Maps key features to specific customer benefits
2. Answers "Why should I care?" for each important feature
3. Uses the customer's language and perspective
4. Shows transformation and improved outcomes
5. Uses the keyword "${keywords}" in a natural heading if possible
6. Format as a structured list with feature and corresponding benefit clearly connected

Write in a benefit-focused, conversational tone. Include a compelling heading that incorporates the keyword.
Output format: [HEADING]\n[FEATURE/BENEFIT PAIRS]`,

    4: `You are an expert copywriter specializing in technical specifications and trust-building.

QUALITY CHECKLIST - Your output must meet ALL of these criteria:
✓ Heading incorporates the keyword naturally
✓ NEVER use H1 heading tags (use H2, H3, or H4 only)
✓ Each spec includes context for why it matters
✓ Specific measurements and metrics provided
✓ Links specs back to customer benefits
✓ Uses quality/expert language (builds confidence)
✓ Addresses durability, warranty, certifications
✓ Uses chunking with bullet/numbered lists and increased white space to enhance readability
✓ PRESERVE ALL NUMBERS: Never change specifications, measurements, weights, or dimensions (e.g., "23"H x 15"W", "42 lbs", "400 lbs capacity") - use exactly as provided in product details
✓ AVOID OVERUSED WORDS: Minimize use of clichéd marketing terms like "versatile", "ample", "durable", "durability", "enhance", "utilize", "leverage", "seamless", "unlock", "harness", "synergize", "catalyze", and "blend of" phrases - use fresh, specific language instead
✓ SPECIFICATIONS FORMAT: Use table block format for specifications lists - this allows specs to be plugged into a structured, scannable table in the product editor
✓ Installation manuals/specs: Create heading as "[Product Name] + Manual", add body text with actual hyperlink on separate line (NEVER put link in heading tag)
✓ MANUAL/DIAGRAM LINKS: When user provides links to installation manuals or diagrams, ALWAYS use a section with a PDF icon and clickable link - prefer these dedicated manual sections when building the page
✓ Length: Detailed specs with 1-2 sentences context each
✓ Tone: Expert, trustworthy, confident

EXAMPLE 1 - Stage 4: Technical Specifications
Product: Airpura R700 Air Purifier
Secondary Keywords: Airpura R700 Tech Specs, Airpura R700

[HEADING]
Airpura R700 Tech Specs

[BODY]
Coverage Area – Up to 2,000 sq. ft. (based on 8 ft. ceilings)

Airflow Speed/ Fan Speed – Up to 635 CFM. The most you will find in a portable air purifier.

Air Exchange per Hour – 360° air distribution allows for 2 air exchanges per hour.

Dimensions – 23" H x 15" W

Housing – Powder coated steel that prevents off gassing.

Weight – 42 lbs.

Noise level – 30.2 dB on low and 63.0 dB on high

WHY THIS WORKS:
✓ Scannable Format: Dash-separated specs are easy to read
✓ Context Added: "(based on 8 ft. ceilings)" - helps customer visualize
✓ Confidence Building: "The most you will find in a portable air purifier"
✓ Simple Structure: Clean, organized list format
✓ Relevant Details: All key specs without overwhelming technical jargon
✓ Material Quality: Mentions "powder coated steel" and benefits (prevents off gassing)

EXAMPLE 2 - Stage 4: Technical Specifications
Product: Evaluation Evolution Auto Fold Heavy Duty Power Wheelchair
Secondary Keywords: Evaluation Auto Fold Power Wheelchair, Evaluation Power Wheelchair Specifications

[HEADING]
Evaluation Auto Fold Power Wheelchair Manual

[BODY]
If you need more information on the specifications, installation, warranty, etc -- Please check out the Owner's Manual.

[Note: Link should appear here in body text, NOT in heading. Suggest adding PDF icon image with alt tag: "Evaluation Evolution Auto Fold Power Wheelchair Owner's Manual PDF"]

Evaluation Power Wheelchair Specifications

Size Unfolded    43" Height X 24.5" Wide X 37.5" Length
Size Folded    14" Thick X 24.5" Wide X 31" Length
Weight (With Battery)    59 Pounds
Weight (Without Battery)    53 Pounds (Battery snaps in & out easily)
Front Wheel (Caster)    8" X 2" Solid Flat Free (Shock Absorbent)
Rear Wheel Tire    12.5" X 2.2" Solid Flat Free (Shock Absorbent)
Weight Capacity    400 lbs
Top Speed    4 Mph
Range    17 Miles
Motor X 2    24v 250 Watt
Turning Radius    23.5"
Battery    Lithium-ion 24v 20ah - (6 Pounds)
Brakes X 2    Intelligent Electro Magnetic
Anti-Tip Wheel X 2    2" X 1"
Incline Ability    25 Percent
International Charger Input    100 - 240 Volts AC
International Charger Output    24 Volt DC 3 AMP
Frame    Aircraft Quality Aluminum Alloy
Seat Cushion    18.5" X 18.5" (2" Thick Memory Foam)
Upholstery    Leather
Wireless Remote Driving Feature    Yes
Wireless Remote Folding & Unfolding    Yes
Arm Rest    Foldable (Load Bearing)

WHY THIS WORKS:
✓ Manual Section: Separate heading for manual with link in body (NOT in heading)
✓ PDF Icon Suggestion: Notes proper alt tag usage for accessibility
✓ Comprehensive Table: Easy to scan comprehensive specifications
✓ Practical Notes: "(Battery snaps in & out easily)" adds confidence
✓ Real-World Metrics: "17 Miles" range - customer can visualize use cases
✓ Technical Completeness: Every relevant spec included for informed decision-making
✓ Yes/No Features: Clear indication of included features at bottom

EXAMPLE 3 - Stage 4: Technical Specifications
Product: Body Solid G9S/G9B Two Stack Gym
Secondary Keywords: Body Solid G9S/G9B Dimensions, Body Solid G9S/G9B

[HEADING]
Body Solid G9S/G9B Dimensions and Footprint

[BODY]
Dimensions: 90"L x 73"W x 84"H
Suggested Area for Usage: 11' 10" x 9' 6" x 7'
Assembled Weight: 964lb
Ships in 7 boxes on a pallet
Heaviest box is 110 lbs

Body Solid G9S/G9U Assembly Manual & Exercise Poster:

Body-Solid G9S Multi-Stack Home Gym System Assembly Manual
Body-Solid G9S Weight Exercise Poster PDF

[Note: Links should appear here in body text, NOT in heading. Suggest adding PDF icon images with alt tags: "Body Solid G9S Assembly Manual PDF" and "Body Solid G9S Exercise Poster PDF"]

WHY THIS WORKS:
✓ Space Planning Help: "Suggested Area for Usage" helps customer visualize in their space
✓ Shipping Transparency: "Ships in 7 boxes... Heaviest box is 110 lbs" - sets expectations
✓ Practical Info: Helps customer prepare for delivery and assembly
✓ Manual Links: Separate section for assembly and exercise resources
✓ Links in Body: Follows guideline - links NOT in headings
✓ PDF Icons: Notes proper image and alt tag usage for manuals
✓ Clean Format: Simple, scannable dimensions without overwhelming detail

---

For the product "${productTitle}", create a compelling Stage 4 section that:
1. Provides technical specifications with context and relevance
2. Explains why each specification matters to the customer
3. Uses specific measurements, materials, or performance metrics
4. Builds confidence through detailed expertise and quality signals
5. Uses the keyword "${keywords}" in a natural heading if possible

Write in a benefit-focused, conversational tone that makes technical info accessible. Include a compelling heading that incorporates the keyword.
Output format: [HEADING]\n[SPECIFICATIONS WITH CONTEXT]`,

    5: `You are an expert copywriter specializing in persuasive calls-to-action and closing statements.

QUALITY CHECKLIST - Your output must meet ALL of these criteria:
✓ Heading incorporates the keyword naturally
✓ NEVER use H1 heading tags (use H2, H3, or H4 only)
✓ Creates clear sense of urgency (time/scarcity based)
✓ Removes final objections (price, warranty, risk)
✓ Specific call-to-action (not vague)
✓ Mentions guarantee or risk-removal
✓ Ends with memorable benefit/transformation
✓ Uses chunking with bullet/numbered lists and increased white space to enhance readability
✓ PRESERVE ALL NUMBERS: Never change specifications, measurements, weights, or dimensions (e.g., "30-day money-back guarantee", "1-2 business days", "$1,200") - use exactly as provided in product details
✓ AVOID OVERUSED WORDS: Minimize use of clichéd marketing terms like "versatile", "ample", "durable", "durability", "enhance", "utilize", "leverage", "seamless", "unlock", "harness", "synergize", "catalyze", and "blend of" phrases - use fresh, specific language instead
✓ NEVER put external links as part of any heading tags (H2, H3, H4, etc.)
✓ Length: 150-200 words body + CTA button text
✓ Tone: Urgent, confident, reassuring

EXAMPLE 1 - Stage 5: Call-to-Action Conclusion
Product: Airpura R700 Air Purifier
Secondary Keywords: Airpura R700, Airpura

[HEADING]
Ready to Experience the Airpura Difference? Order Your R700 Today

[BODY]
You've waited long enough. Your family deserves clean air, and you've just learned exactly how to get it. The only question is whether you're going to take action now or keep waking up sneezing.

Here's what makes this risk-free:
• 30-day money-back guarantee: Try it in your home. If you don't notice the difference, we refund every penny.
• 10-year warranty: We stand behind Airpura's Canadian engineering because it's built to last a decade.
• Free shipping: No surprises at checkout.
• Installation support: We'll walk you through setup if you need help.

Orders ship within 1-2 business days. Most customers notice improved air quality within 24 hours of running the R700 continuously.

Imagine waking up tomorrow with clear sinuses. Breathing easily. Your kids sleeping through the night without coughing. That future is just one click away.

[CTA BUTTON TEXT: Order My Airpura R700 + Free Shipping]

EXAMPLE 2 - Stage 5: Call-to-Action Conclusion
Product: Evaluation Evolution Auto Fold Heavy Duty Power Wheelchair
Secondary Keywords: Evaluation Auto Fold Electric Wheelchair, Evaluation Electric Wheelchair

[HEADING]
Evaluation Auto Fold Electric Wheelchair: Secure and Empower Your Mobility

[BODY]
You deserve independence and mobility without compromise. You've just discovered how automatic folding technology changes everything—now it's time to experience it yourself.

Here's what makes this decision risk-free:
• 30-day trial period: Use the Evaluation Evolution in your daily life. If it doesn't transform your mobility, return it for a full refund.
• 2-year warranty: Frame, electronics, and motors are covered. If anything fails, we replace it at no cost.
• White-glove delivery available: We'll deliver, assemble, and train you on operation at your home.
• Medicare/Insurance accepted: We handle the paperwork and work directly with your insurance provider.

Limited stock available for immediate shipping. Most orders ship within 3-5 business days.

Picture yourself visiting family without needing help loading your wheelchair. Shopping independently. Traveling again. That freedom is waiting for you.

[CTA BUTTON TEXT: Secure My Evaluation Evolution Wheelchair]

EXAMPLE 3 - Stage 5: Call-to-Action Conclusion
Product: Body Solid G9S/G9B Two Stack Gym
Secondary Keywords: Body Solid G9S/G9B, Body Solid G9S/G9B All in One Home Gym

[HEADING]
Can It Get Any Better? Yep. Add Body Solid G9S/G9B Attachments To Your Gym

[BODY]
You've seen the specs. You know this replaces an entire gym. The only question left is whether you're ready to stop paying monthly gym fees and start building muscle at home.

Here's what makes this the smartest investment:
• Lifetime warranty on frame: This is the last home gym you'll ever buy. Body Solid guarantees the frame forever.
• 0% financing available: Break payments into affordable monthly installments—often less than your current gym membership.
• White-glove delivery + assembly: Professional installation included. We set it up in your home gym space and remove all packaging.
• 30-day trial: Use it for a month. If you don't love training at home, return it for a full refund.

Current promotion: Free leg press attachment ($299 value) with purchase. Offer ends when current inventory sells out.

Imagine never waiting for equipment again. Training on your schedule. Saving $1,200+ per year in gym fees. That's your new reality.

[CTA BUTTON TEXT: Get My Body Solid G9S + Free Leg Press]

---

For the product "${productTitle}", create a compelling Stage 5 section that:
1. Creates urgency and motivation to take action
2. Removes final objections or barriers
3. Clearly states the next step (purchase, learn more, etc.)
4. Includes a strong, action-oriented call-to-action
5. Uses the keyword "${keywords}" in a natural heading if possible
6. Ends with a memorable benefit or guarantee

Write in a benefit-focused, conversational tone with power words. Include a compelling heading that incorporates the keyword.
Output format: [HEADING]\n[BODY CONTENT]\n[CTA BUTTON TEXT: XXX]`,
  };

  return stagePrompts[stage] || stagePrompts[1];
}

/**
 * Generate product description for a specific stage
 * Stages: 1=Problem, 2=Solution, 3=Benefits, 4=Specs, 5=CTA
 */
export const generateProductDescriptionStage = async (
  supplierDescription,
  imageUrls = [],
  productTitle,
  stage = 1,
  options = {}
) => {
  try {
    const { secondaryKeywords = [], previousStageContent = null } = options;

    // Build the system prompt for this stage
    const systemPrompt = buildProductDescriptionPrompt(stage, productTitle, secondaryKeywords);

    // Build the user prompt with context
    let userPrompt = `Product Title: ${productTitle}

Supplier Information:
${supplierDescription}

IMPORTANT: If the supplier information contains links to installation manuals, diagrams, spec sheets, or PDF documents:
- Create a dedicated section for these resources with a proper heading like "[Product Name] Manual" or "[Product Name] Installation Guide"
- Add the link in the BODY text, never in the heading
- Suggest using a PDF icon image next to the link
- Include proper alt tags for the PDF icon (e.g., "${productTitle} Installation Manual PDF")
- Prioritize including these manual sections when building the product description`;

    if (imageUrls && imageUrls.length > 0) {
      userPrompt += `

Product Images (${imageUrls.length}): ${imageUrls.join(', ')}

IMAGE USAGE GUIDELINES:
- Use these image URLs as reference for product appearance, features, and context
- Include lifestyle images that show the story you're telling
- When suggesting image placement, provide descriptive alt tags for each image
- Alt tags should include the product name and describe what the image shows
- Suggest renaming images with descriptive, SEO-friendly names
- Example alt tag format: "${productTitle} - [descriptive action or feature shown in image]"`;
    }

    if (previousStageContent && stage > 1) {
      userPrompt += `

Previous Stage Content (for context):
${previousStageContent}

Build on this foundation without repeating it.`;
    }

    userPrompt += `

IMPORTANT FORMATTING RULES (apply to all stages):
- NEVER use H1 heading tags (only use H2, H3, H4)
- NEVER include external links as part of heading tags
- Use chunking with bullet/numbered lists to increase white space and readability
- Separate sections clearly with proper formatting
- Include videos and pictures where beneficial to support the content
- SPECIFICATIONS: Format specifications as tables/structured lists for the product editor
- MANUALS/DIAGRAMS: When user provides manual or diagram links, create dedicated sections with PDF icon + clickable link (link in body, NOT in heading)

Generate the content for Stage ${stage}. Focus on creating compelling, benefit-focused copy.`;

    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const content = completion.choices[0].message.content.trim();

    return {
      success: true,
      stage,
      content,
      usage: {
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens,
      },
    };
  } catch (error) {
    console.error('Generate Product Description Stage Error:', error);
    throw {
      code: 'DESCRIPTION_ERROR',
      message: 'Failed to generate product description stage',
    };
  }
};

/**
 * Refine a product description stage based on user feedback
 */
export const refineProductStageContent = async (
  stageContent,
  feedback,
  stage,
  options = {}
) => {
  try {
    const { secondaryKeywords = [] } = options;
    const keywords = secondaryKeywords.length > 0 ? secondaryKeywords.join(', ') : '';

    const refinementPrompt = `You are refining a product description stage based on user feedback.

Original Stage ${stage} Content:
${stageContent}

User Feedback:
${feedback}

Please revise the content to address the feedback while:
1. Maintaining the core message and purpose of Stage ${stage}
2. Keeping the benefit-focused copywriting approach
3. Incorporating the keywords naturally if applicable: ${keywords}
4. Improving clarity, persuasiveness, and engagement

Return only the revised content.`;

    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert copywriter refining product description content based on feedback.',
        },
        {
          role: 'user',
          content: refinementPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const refinedContent = completion.choices[0].message.content.trim();

    return {
      success: true,
      stage,
      originalContent: stageContent,
      refinedContent,
      feedback,
      usage: {
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens,
      },
    };
  } catch (error) {
    console.error('Refine Product Stage Error:', error);
    throw {
      code: 'REFINE_ERROR',
      message: 'Failed to refine product description stage',
    };
  }
};

/**
 * SECTION BUILDER FRAMEWORK - SECTION-BY-SECTION GENERATION
 * New approach: Generate ordered sections (1-12) instead of fixed stages
 */

/**
 * Plan sections for a product page
 * Returns ordered list of sections to generate
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
"introSummary"              // brief intro + size/fit + key value
"imageWithBenefits"         // 1 key image + 4–8 benefit bullets
"benefitsTextSoftCTA"       // prose benefits; CTA as closing sentence (no new section)
"imageReview"               // hero customer photo + quote/attribution
"manualsLinks"              // up to 3 PDFs, labeled
"specTable"                 // table or listMode for sparse specs
"comparisonTable"           // if ≥3 metrics exist
"faq"                       // if real FAQs exist
"gallery"                   // optional mixed images; not first
"shippingReturns"           // if provided
"warrantyCompliance"        // if provided
"text"                      // fallback generic text block

RULES (split/merge/ordering)
1) Don't use "stages". Produce Section 1..N in narrative order.
2) Section 1 MUST be "introSummary" unless inputs are too weak; then "text".
   - If storage_fit or dimensional high-signal specs exist, include a single line like "Stores X/Y; footprint W×D×H".
3) Prefer this baseline flow when inputs allow:
   1) introSummary
   2) imageWithBenefits
   3) benefitsTextSoftCTA
   4) imageReview  (only if a real customer image or quote exists)
   5) manualsLinks (if any)
   6) specTable    (always if specs exist; listMode when <5)
   Optional: faq, comparisonTable, gallery, shippingReturns, warrantyCompliance
4) Split a concept into multiple sections when any item count >8, or themes are distinct (e.g., Security vs Weather).
5) Merge adjacent lightweight plans (<3 bullets/rows each) to stay within section limits.
6) Never introduce a hard CTA section; soft close is allowed inside benefitsTextSoftCTA.
7) If a required input is missing for a section (e.g., no manual URLs), OMIT that section.
8) Min sections = 2, Max sections = 8. Prioritize most important content if product data would generate more than 8 sections.

OUTPUT (STRICT JSON)
{
  "sections": [
    {
      "index": 1,
      "type": "introSummary",
      "goal": "one sentence",
      "source_refs": ["benefits[0..3]","specs[group:Dimensions]"],
      "min_required_fields": ["heading","body"],
      "constraints": {
        "max_bullets": 6,
        "listMode": false,
        "groupBy": null
      },
      "confidence": 0.9,
      "notes": { "issues":[], "todos":[], "split_reason":null, "merge_reason":null }
    }
  ]
}

VALIDATION CHECKS
- First section must not require external media to make sense.
- If specs exist but are sparse (<5 rows) set constraints.listMode=true on specTable.
- If reviews[].image_id exists → allow imageReview; else omit.
- If manuals_links empty → omit manualsLinks.

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
    introSummary: `${sharedStyle}

TYPE: introSummary
{
  "heading": "<short benefit-led title>",
  "subhead": "<one-liner value proposition>",
  "storage_line": "Stores <items>; footprint <W×D×H> if available",
  "body": "40–70 words; mention material, durability, and use cases.",
  "badges": ["Free Shipping", "15-Year Warranty"] // only if true in context
}`,

    imageWithBenefits: `${sharedStyle}

TYPE: imageWithBenefits
{
  "heading": "<short>",
  "bullets": ["..."], // 4–8, tie to features/specs
  "image_intent": "landscape lifestyle OR white-background hero",
  "caption": "optional single line",
  "qa_sources": ["features[...]", "specs[...]" ]
}`,

    benefitsTextSoftCTA: `${sharedStyle}

TYPE: benefitsTextSoftCTA
{
  "heading": "<short>",
  "paragraphs": ["70–120 words total split into 1–2 paragraphs; map to features/specs"],
  "soft_cta_sentence": "Close with a single natural purchase suggestion."
}`,

    imageReview: `${sharedStyle}

TYPE: imageReview
{
  "heading": "What Customers Say",
  "quote": "verbatim or lightly edited for clarity",
  "author": "Name, location (if available)",
  "image_required": true,
  "alt_hint": "customer using <product> in <setting>"
}`,

    manualsLinks: `${sharedStyle}

TYPE: manualsLinks
{
  "heading": "Manuals & Guides",
  "links": [
    {"label":"Assembly Manual (PDF)","url":"..."},
    {"label":"Spec Sheet (PDF)","url":"..."}
  ],
  "note": "Link opens in a new tab."
}`,

    specTable: `${sharedStyle}

TYPE: specTable
{
  "heading": "Specifications",
  "mode": "table" | "list",
  "columns": ["Specification","Value"], // for table
  "rows": [ ["Overall (W×D×H)","..."], ["Door Opening","..."] ], // table
  "listItems": ["Panel Material: ...","Frame: ..."], // listMode
  "unit_notes": "All dimensions in inches unless noted."
}`,

    comparisonTable: `${sharedStyle}

TYPE: comparisonTable (only if comparisons exist)
{
  "heading": "How It Compares",
  "columns": ["Metric","This Model","Competitor A","Note"],
  "rows": [ ["Wind Rating","...","...","..."], ... ]
}`,

    faq: `${sharedStyle}

TYPE: faq
{
  "heading": "Common Questions",
  "items": [ {"q":"...","a":"..."} ] // 3–6 pairs, grounded in context
}`,

    gallery: `${sharedStyle}

TYPE: gallery
{
  "heading": "In the Real World",
  "image_intent": "mix lifestyle + detail; 4–8 images",
  "captions": ["..."]
}`,

    shippingReturns: `${sharedStyle}

TYPE: shippingReturns
{
  "heading": "Shipping & Returns",
  "bullets": ["Lead time: ...", "Curbside freight...", "Return window/restocking..."]
}`,

    warrantyCompliance: `${sharedStyle}

TYPE: warrantyCompliance
{
  "heading": "Warranty & Standards",
  "bullets": ["Warranty: ...", "Certifications: UL/ASTM...", "How to claim: ..."]
}`,

    text: `${sharedStyle}

TYPE: text (fallback)
{
  "heading": "<short>",
  "body": "50–90 words summarizing key value",
  "todo": ["Missing specs","Need manual link"]
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
  generateProductDescriptionStage,
  refineProductStageContent,
  // Section Builder Framework methods
  planSections,
  realizeSection,
  assignMedia,
  validateSection,
};
