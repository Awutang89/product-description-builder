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
    const prompt = `Given the product title: "${productTitle}"

Generate 4-6 secondary keywords that:
1. Are variations or related keywords to the main product
2. Can be used as headings throughout a product description
3. Are SEO-friendly
4. Provide good variety while staying relevant
5. Are suitable for different sections of a sales page

Return only the keywords as a comma-separated list, nothing else.`;

    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an SEO expert and copywriter. Generate keyword variations from product titles.',
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
      message: 'Failed to generate secondary keywords',
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
✓ Identifies a specific, relatable customer problem (not generic)
✓ Shows deep understanding of customer pain points
✓ Creates empathy - customer feels understood
✓ Validates frustration with emotional language
✓ Sets up product as the logical next step
✓ Length: 150-250 words of body content
✓ Tone: Conversational, empathetic, not salesy

EXAMPLE 1 - Stage 1: Problem Identification
Product: Airpura R700 Air Purifier
Secondary Keywords: Airpura R700, R700 Air Purifier, Airpura, R700 Airpura

[HEADING]
Give Your Family the Gift of Clean Air with the Airpura R700

[BODY]
You probably don't think about the air you breathe at home. But every night, your family is inhaling dust mites, pet dander, pollen, and microscopic particles that accumulate in your bedroom. If you've noticed increased sneezing, allergies flaring up, or that stuffy feeling when you wake up, your lungs are trying to tell you something.

Most traditional fans just push this contaminated air around. Air purifiers on shelves at big box stores? They're often underpowered and loud enough to keep you awake. You deserve clean air that doesn't compromise on comfort.

The solution exists—it just needs to be the right one.

EXAMPLE 2 - Stage 1: Problem Identification
Product: Evaluation Evolution Auto Fold Heavy Duty Power Wheelchair
Secondary Keywords: Evaluation Electric Wheelchair, Evaluation Evolution Fully Automatic Folding Power Wheelchair

[HEADING]
Discover Freedom with the Evaluation Evolution Fully Automatic Folding Power Wheelchair

[BODY]
Mobility shouldn't mean sacrificing independence or convenience. If you've struggled with bulky, heavy wheelchairs that require help to transport, or flimsy lightweight models that feel unstable on uneven surfaces, you know the frustration of compromising between portability and durability.

Traditional power wheelchairs are either too heavy to lift into a car or too lightweight to feel secure on ramps and outdoor terrain. You need something that folds automatically, supports your weight confidently, and doesn't leave you stranded when you want to travel.

True mobility freedom exists—and it doesn't require choosing between strength and portability.

EXAMPLE 3 - Stage 1: Problem Identification
Product: Body Solid G9S/G9B Two Stack Gym
Secondary Keywords: Body Solid G9S/G9B All in One Home Gym, Body Solid G9S/G9B Universal Gym

[HEADING]
The Body Solid G9S/G9B All in One Home Gym: The Last Machine You'll Ever Need

[BODY]
Gym memberships are expensive, crowded, and inconvenient. You're paying $50-100 per month to wait for equipment, deal with other people's sweat, and commute 20 minutes each way. Home gym equipment? Most machines only work a few muscle groups, forcing you to buy multiple pieces that take over your entire basement.

You want the variety of a full commercial gym in your home without needing a warehouse-sized space or spending $10,000 on separate machines. You need real strength training, not just resistance bands or adjustment-heavy contraptions.

A complete strength training solution exists—one machine that replaces an entire gym floor.

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
✓ Explains the core mechanism/how it actually works
✓ Shows before → after transformation clearly
✓ Uses accessible language (no jargon)
✓ Highlights the innovation or unique approach
✓ Addresses the specific problem from Stage 1
✓ Length: 150-250 words of body content
✓ Tone: Clear, logical, reassuring

EXAMPLE 1 - Stage 2: Solution Explanation
Product: Airpura R700 Air Purifier
Secondary Keywords: R700 Air Purifier, Airpura

[HEADING]
What is New and Improved for the R700 Air Purifier?

[BODY]
Unlike basic fan-based purifiers, the Airpura R700 uses hospital-grade HEPA filtration—the same technology used in operating rooms. Here's how it works: air is pulled through multiple filter layers. First, a pre-filter catches large particles like dust and pet hair. Then the HEPA filter traps 99.97% of particles as small as 0.3 microns—that includes pollen, mold spores, and dust mites.

The result? Within 24 hours of running continuously, your bedroom air quality improves dramatically. You'll notice it immediately: easier breathing, fewer allergies, and waking up refreshed instead of congested.

But unlike clinical purifiers that sound like a jet engine, the R700 runs at whisper-quiet levels. You get hospital-grade air cleaning without the hospital noise.

EXAMPLE 2 - Stage 2: Solution Explanation
Product: Evaluation Evolution Auto Fold Heavy Duty Power Wheelchair
Secondary Keywords: Evaluation Heavy Duty Power Wheelchair Design, Evaluation Folding Wheelchair

[HEADING]
Evaluation Heavy Duty Power Wheelchair Design: Stability Meets Lightweight Agility

[BODY]
The Evaluation Evolution combines heavy-duty construction with intelligent automatic folding technology. Here's how it works: a reinforced steel frame supports up to 330 lbs, while the patented auto-fold mechanism collapses the entire wheelchair with one button press—no manual lifting or disassembly required.

The transformation is remarkable: in 10 seconds, it folds to fit in your car trunk. The advanced suspension system absorbs bumps on outdoor terrain, giving you stability on ramps and sidewalks that lightweight wheelchairs can't match. You get the durability of a traditional power chair with the portability of a travel scooter.

Before, you chose between strength or convenience. Now, you get both—automatic folding that doesn't compromise on stability or weight capacity.

EXAMPLE 3 - Stage 2: Solution Explanation
Product: Body Solid G9S/G9B Two Stack Gym
Secondary Keywords: Body Solid G9S/G9B Universal Gym

[HEADING]
The Body Solid G9S/G9B Universal Gym Has Nearly Every Exercise In The Book

[BODY]
The Body Solid G9S/G9B features two 210-pound weight stacks and over 75 exercise stations—all in one 6-foot footprint. Here's how it works: dual weight stacks allow two people to train simultaneously, or let you superset exercises without changing stations. The multi-press station, leg developer, ab crunch, pec dec, and cable crossover system are all integrated.

The result? You can perform compound exercises (bench press, squats, rows) and isolation movements (bicep curls, lateral raises) without ever leaving the machine. No more waiting for equipment or buying separate machines for legs, chest, back, and shoulders.

You're getting a complete commercial-grade gym that fits in your basement—for less than one year of gym membership fees.

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
✓ Each feature clearly tied to customer benefit
✓ Answers "Why should I care?" for each feature
✓ Uses customer perspective language, not specs
✓ Shows real-world transformation/outcomes
✓ Specific and concrete (not vague)
✓ Length: 4-6 feature/benefit pairs with detail
✓ Tone: Conversational, benefit-focused

EXAMPLE 1 - Stage 3: Feature → Benefit Mapping
Product: Airpura R700 Air Purifier
Secondary Keywords: Airpura R700, Airpura

[HEADING]
What Does the Filtration System Look Like Inside the Airpura R700?

• HEPA-Barrier True HEPA Filter → Removes 99.97% of particles as small as 0.3 microns
  Why it matters: Your allergies actually improve instead of just "managing" them. Asthma attacks become less frequent. Pollen, dust mites, and pet dander are captured before reaching your lungs.

• 18 lbs of Activated Carbon → Removes chemicals, VOCs, and odors from the air
  Why it matters: No more chemical smell from new furniture or cleaning products. Your home smells fresh naturally, not masked with air fresheners.

• 360-Degree Air Intake → Pulls contaminated air from all directions simultaneously
  Why it matters: The entire room gets cleaned faster—not just the air directly in front of the unit. Complete room coverage in half the time.

• Eco-Friendly Features From Airpura → Energy Star rated, uses 50% less electricity than competitors
  Why it matters: Run it 24/7 without guilt or high electric bills. Clean air that's good for your wallet and the planet.

EXAMPLE 2 - Stage 3: Feature → Benefit Mapping
Product: Evaluation Evolution Auto Fold Heavy Duty Power Wheelchair
Secondary Keywords: Evaluation Auto Fold Electric Wheelchair, Evaluation Electric Wheelchair

[HEADING]
Advanced Suspension for Evaluation Electric Folding Wheelchair

• One-Button Automatic Folding → Collapses in 10 seconds without manual effort
  Why it matters: No more asking for help loading your wheelchair. Independence means doing it yourself—and this makes it effortless.

• 330 lb Weight Capacity with Reinforced Frame → Heavy-duty construction that feels solid and stable
  Why it matters: You're not worried about the chair wobbling or feeling flimsy. Confidence on ramps, sidewalks, and uneven surfaces. Built to last years, not months.

• Dual Motor System → Independent motors for each wheel provide better control
  Why it matters: Smoother turns, better traction on slopes, and reliable performance. No more getting stuck on inclines or struggling with tight corners.

• Joystick Control + Emergency Stop → Intuitive operation with safety failsafe
  Why it matters: Easy to learn even if you've never used a power wheelchair. The emergency stop gives you peace of mind—you're always in control.

EXAMPLE 3 - Stage 3: Feature → Benefit Mapping
Product: Body Solid G9S/G9B Two Stack Gym
Secondary Keywords: Body Solid G9S/G9B, Body Solid G9S/G9B All in One Home Gym

[HEADING]
The Body Solid G9S/G9B Price Includes Premium Features, Parts Well Rounded Design

• Two 210 lb Weight Stacks → Train with a partner or superset exercises instantly
  Why it matters: No more waiting between sets or for your workout partner. Cut your workout time in half while maintaining intensity.

• 75+ Exercise Variations → Every major muscle group covered in one machine
  Why it matters: You're getting chest press, leg extension, cable crossovers, lat pulldowns, and more—without buying separate machines. One purchase replaces an entire gym.

• Commercial-Grade Aircraft Cable → 2,000 lb tensile strength, doesn't stretch or fray
  Why it matters: This is the same cable used in $10,000 commercial gym equipment. It won't break, won't need replacing, and feels smooth for decades.

• Lifetime Warranty on Frame → Body Solid stands behind their construction forever
  Why it matters: This is the last home gym you'll ever buy. If anything breaks, they replace it—no questions asked.

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
✓ Each spec includes context for why it matters
✓ Specific measurements and metrics provided
✓ Links specs back to customer benefits
✓ Uses quality/expert language (builds confidence)
✓ Addresses durability, warranty, certifications
✓ Length: Detailed specs with 1-2 sentences context each
✓ Tone: Expert, trustworthy, confident

EXAMPLE 1 - Stage 4: Technical Specifications
Product: Airpura R700 Air Purifier
Secondary Keywords: Airpura R700 Tech Specs, Airpura R700

[HEADING]
Airpura R700 Tech Specs

Coverage & Performance
• Room Coverage: Up to 2,000 square feet (fully filters room air 5x per hour)
  Why it matters: This covers an entire floor or large open-concept space—not just a bedroom. Commercial-grade performance for your home.

• CADR Rating: 560 CFM (Clean Air Delivery Rate)
  Why it matters: Third-party verified performance. You're not trusting marketing claims—this is the industry standard measurement and significantly higher than competitors.

• Filter System: True HEPA + 18 lbs Activated Carbon
  Why it matters: Hospital-grade filtration plus industrial-strength odor/chemical removal. This is what they use in operating rooms and chemical labs.

Durability & Support
• Filter Lifespan: 5 years for carbon, 3-5 years for HEPA (depending on usage)
• Warranty: 10-year limited warranty on parts and labor
• Made in Canada with North American components
  Why it matters: You're protected for a decade. If anything fails, Airpura replaces it. Canadian manufacturing standards are among the strictest in the world.

EXAMPLE 2 - Stage 4: Technical Specifications
Product: Evaluation Evolution Auto Fold Heavy Duty Power Wheelchair
Secondary Keywords: Evaluation Auto Fold Power Wheelchair, Evaluation Power Wheelchair Specifications

[HEADING]
Evaluation Auto Fold Power Wheelchair Manual

Performance & Capacity
• Weight Capacity: 330 lbs with reinforced steel frame
  Why it matters: Heavy-duty construction that accommodates most adults comfortably. The frame won't flex or feel unstable like lightweight models.

• Battery Range: 12-15 miles per charge (dual lithium-ion batteries)
  Why it matters: Go all day without range anxiety. Visit the mall, run errands, spend time outdoors—without worrying about getting stranded.

• Top Speed: 4 mph with variable speed control
  Why it matters: Fast enough to keep pace with walking companions, but controlled enough for indoor navigation and safety.

Portability & Convenience
• Folded Dimensions: 30" x 20" x 16" (fits in most car trunks)
• Weight: 58 lbs total (with batteries)
• Fold Time: 10 seconds automatic with one-button activation
  Why it matters: True portability without sacrificing durability. Take it anywhere—travel, appointments, vacations—without needing a wheelchair van.

Warranty & Support
• 2-year warranty on frame and electronics
• 1-year warranty on batteries
• FDA registered medical device
  Why it matters: You're protected. FDA registration means it meets strict safety and quality standards. If anything fails during warranty, it's replaced.

EXAMPLE 3 - Stage 4: Technical Specifications
Product: Body Solid G9S/G9B Two Stack Gym
Secondary Keywords: Body Solid G9S/G9B Dimensions, Body Solid G9S/G9B

[HEADING]
Body Solid G9S/G9B Dimensions and Footprint

Capacity & Performance
• Dual Weight Stacks: 210 lbs each (420 lbs total resistance)
  Why it matters: Serious weight for serious lifters. This isn't a toy—it's commercial gym equipment designed for progressive overload and muscle building.

• 75+ Exercise Stations: Full body coverage including chest, back, shoulders, legs, abs
  Why it matters: Every major and minor muscle group covered. You're not limited to basic exercises—this supports advanced training programs.

• Cable System: 2,000 lb tensile strength aircraft-grade cables
  Why it matters: Commercial-grade components that won't stretch, fray, or break. The same cables used in $15,000+ gym equipment.

Dimensions & Space Requirements
• Assembled Dimensions: 88"L x 78"W x 83"H
• Footprint: Approximately 48 square feet
• Weight: 850 lbs (rock-solid stability, no movement during use)
  Why it matters: Fits in most basements or garage gym spaces. The weight means it stays planted—no shifting or wobbling during heavy lifts.

Warranty & Craftsmanship
• Lifetime Warranty: Frame and welds (non-prorated, transferable)
• 5-Year Warranty: Cables, pulleys, and all moving parts
• 2-Year Warranty: Upholstery and grips
  Why it matters: Body Solid has been in business for 40+ years. This warranty is real—they stand behind every machine forever. This is the last home gym you'll ever need to buy.

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
✓ Creates clear sense of urgency (time/scarcity based)
✓ Removes final objections (price, warranty, risk)
✓ Specific call-to-action (not vague)
✓ Mentions guarantee or risk-removal
✓ Ends with memorable benefit/transformation
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
${supplierDescription}`;

    if (imageUrls && imageUrls.length > 0) {
      userPrompt += `

Product Images (${imageUrls.length}): ${imageUrls.join(', ')}
Use these image URLs as reference for product appearance, features, and context.`;
    }

    if (previousStageContent && stage > 1) {
      userPrompt += `

Previous Stage Content (for context):
${previousStageContent}

Build on this foundation without repeating it.`;
    }

    userPrompt += `

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

export default {
  generateContent,
  generateVariations,
  scoreContent,
  refineContent,
  generateSecondaryKeywords,
  generateProductDescriptionStage,
  refineProductStageContent,
};
