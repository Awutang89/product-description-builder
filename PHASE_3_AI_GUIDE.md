# Phase 3: AI Integration Guide

**Status**: Complete ✅
**Date**: October 25, 2025

---

## 🤖 AI System Overview

Page Crafter now includes a **powerful AI content generation system** with **example-based learning**. The AI learns from your examples to generate content that matches your style and brand voice.

---

## 🏗️ Architecture

### Backend Components

#### 1. **AI Service** (`backend/src/services/aiService.js`)
- OpenAI integration with GPT-4o-mini
- Example-based prompting
- Content generation with context
- Variation generation (A/B testing)
- Content scoring and analysis
- Refinement based on feedback

#### 2. **AI Example Model** (`backend/src/models/AIExample.js`)
- Store and manage learning examples
- Category-based organization
- Quality rating system
- Usage tracking
- Effectiveness metrics
- Approval workflow

#### 3. **AI Controller** (`backend/src/controllers/aiController.js`)
- 11 API endpoints
- Content generation
- Example management
- Approval system
- Usage tracking

#### 4. **AI Routes** (`backend/src/routes/aiRoutes.js`)
- All AI endpoints configured
- RESTful API design
- Integrated with main routes

### Frontend Components

#### 1. **AI Store** (`frontend/src/store/aiStore.js`)
- Zustand store for AI state
- Generation and example management
- Loading states and error handling
- Content caching

#### 2. **AI Generator Component** (`frontend/src/components/AIGenerator.jsx`)
- Generate content with prompts
- Select examples to learn from
- Generate variations for A/B testing
- Copy and use generated content

#### 3. **Example Manager Component** (`frontend/src/components/ExampleManager.jsx`)
- Create new examples
- Approve/reject examples
- View usage statistics
- Manage learning data

#### 4. **Enhanced Settings Panel** (`frontend/src/components/SettingsPanelV2.jsx`)
- 3 tabs: Properties, AI, Examples
- Integrated AI generation
- Example management
- Seamless content insertion

#### 5. **AI Service** (`frontend/src/services/aiService.js`)
- All API calls to AI endpoints
- Example management
- Content generation

---

## 📊 API Endpoints

### Content Generation

```
POST /api/ai/generate
Generate content with optional examples
Request:
{
  prompt: "Create a compelling hero title",
  sectionType: "hero",
  exampleIds: ["ex1", "ex2"],
  temperature: 0.7,
  maxTokens: 500
}

Response:
{
  success: true,
  data: {
    content: "...",
    usage: {
      promptTokens: 100,
      completionTokens: 50,
      totalTokens: 150
    }
  }
}
```

### Generate Variations

```
POST /api/ai/variations
Generate multiple content variations
Request:
{
  prompt: "...",
  sectionType: "hero",
  count: 3,
  exampleIds: ["ex1", "ex2"]
}

Response:
{
  success: true,
  data: {
    variations: [
      { id: "variation-1", content: "..." },
      { id: "variation-2", content: "..." }
    ]
  }
}
```

### Score Content

```
POST /api/ai/score
Score generated content quality
Request:
{
  content: "...",
  sectionType: "hero",
  criteria: ["Clarity", "Persuasiveness", ...]
}

Response:
{
  success: true,
  data: {
    scores: { "Clarity": 8, "Persuasiveness": 9 },
    feedback: "..."
  }
}
```

### Refine Content

```
POST /api/ai/refine
Refine content based on feedback
Request:
{
  originalContent: "...",
  feedback: "Make it shorter",
  sectionType: "hero",
  exampleIds: ["ex1"]
}

Response:
{
  success: true,
  data: {
    originalContent: "...",
    refinedContent: "...",
    feedback: "..."
  }
}
```

### Example Management

```
POST   /api/ai/examples              Create example
GET    /api/ai/examples              List examples
GET    /api/ai/examples/:id          Get single
PUT    /api/ai/examples/:id          Update
DELETE /api/ai/examples/:id          Delete
POST   /api/ai/examples/:id/approve  Approve for use
POST   /api/ai/examples/:id/use      Record usage
```

---

## 🎯 How to Use AI Features

### 1. Generate Content

1. Open editor and select a section
2. Click "AI" tab in right panel
3. Enter a prompt describing what you want
4. Click "Generate"
5. Review generated content
6. Click "Use This" to insert

### 2. Learn from Examples

1. In AI Generator, click "Learn from Examples"
2. Select examples matching your desired style
3. More examples = better AI learning
4. Generate content with examples selected
5. AI will match the style shown in examples

### 3. Create Learning Examples

1. Click "Learn" tab in settings panel
2. Click "New Example"
3. Fill in:
   - Example name
   - Input (the prompt you used)
   - Output (the generated content you liked)
   - Optional notes
4. Click "Save Example"
5. The example will be pending approval
6. Click "Approve" to use it

### 4. Generate Variations

1. Write your prompt
2. Select examples (optional)
3. Choose number of variations (1-5)
4. Click "Variations" button
5. AI generates multiple options
6. Choose the best one and click "Use"

### 5. Refine Generated Content

1. Generate content as usual
2. Copy it and make manual edits
3. Add feedback notes
4. Use "Refine" to improve based on feedback

---

## 🎓 Example-Based Learning

### What Are Examples?

Examples teach the AI your preferred style, tone, and approach. When you select examples before generating, the AI uses them as a reference.

### How Do Examples Work?

1. **Input**: The prompt or request
2. **Output**: The content you want
3. **Note**: Why this is a good example
4. **Teaching**: AI studies patterns in examples
5. **Generation**: Creates similar content

### Best Practices for Examples

✅ **DO:**
- Create examples for each section type
- Include diverse examples (short, long, different tones)
- Use real examples from your brand
- Approve only high-quality examples
- Tag examples for easy finding

❌ **DON'T:**
- Use low-quality examples
- Mix different styles in one set
- Approve without reviewing
- Delete approved examples frequently
- Create vague examples

### Example Strategy

**For Premium Products:**
- Use elegant, sophisticated language
- Focus on exclusivity and craftsmanship
- Examples from luxury brands

**For Budget Products:**
- Direct, honest benefits
- Emphasis on value
- Examples highlighting affordability

**For Tech Products:**
- Technical accuracy with simple language
- Innovation and cutting-edge features
- Examples from tech industry leaders

---

## 🚀 Advanced Features

### A/B Testing with Variations

Generate 3-5 variations and test which performs best:

1. Generate variations
2. Use each version in different sections
3. Track engagement metrics
4. Keep best performing version

### Content Refinement Workflow

1. Generate initial content
2. Review and get feedback
3. Use "Refine" to improve
4. Iterate until perfect

### Batch Generation

Generate content for multiple sections:

1. Create examples first
2. For each section, generate with same examples
3. Content will be consistent across sections
4. Brand voice remains unified

---

## 🔧 Setup & Configuration

### Prerequisites

1. OpenAI API key
2. Backend running
3. MongoDB connected

### Configuration

1. Add OpenAI API key to `.env`:
   ```
   OPENAI_API_KEY=sk-...
   ```

2. That's it! The system is ready to use

### Models Available

- `gpt-4o-mini` (Default, fast & cheap)
- `gpt-4o` (More powerful, costs more)
- Custom models via settings

---

## 📊 Understanding Scores

When scoring content, the AI evaluates:

- **Clarity**: Is message clear and easy to understand?
- **Persuasiveness**: Does it convince and motivate?
- **Relevance**: Appropriate for section type?
- **Engagement**: Does it capture attention?
- **Tone**: Appropriate tone for product/audience?

Scores range from 1-10 for each criterion.

---

## 💡 Pro Tips

### Optimize Token Usage
- Be specific in prompts (saves tokens)
- Use examples (better results with fewer tokens)
- Start with lower `maxTokens` (increase if needed)

### Better Generations
- Write clear, detailed prompts
- Provide context about product
- Mention target audience
- Specify tone/style

### Example Selection
- Start with 1-2 examples
- Increase if results aren't great
- Mix examples if wanting hybrid style
- Use approved examples only

### Consistency
- Create brand voice examples early
- Reuse same examples across sections
- Document your style preferences
- Update examples as brand evolves

---

## 🔐 Security & Privacy

### Your Data
- Examples stored in MongoDB
- Generation prompts sent to OpenAI
- No personal data collected
- You control all content

### OpenAI Usage
- Each generation costs tokens
- Variations are separate calls
- Monitor API usage in OpenAI dashboard
- Set rate limits if needed

### Example Privacy
- Examples are private by default
- Approval doesn't make them public
- Only you see your examples
- Can be deleted anytime

---

## 🧪 Testing the AI System

### Quick Test

1. Backend running: `cd backend && npm run dev`
2. Frontend running: `cd frontend && npm run dev`
3. Create a project
4. Edit a section (e.g., hero)
5. Click "AI" tab
6. Enter prompt: "Create a title for a premium coffee brand"
7. Click "Generate"
8. See generated content
9. Click "Use This"

### Test with Examples

1. Go to "Learn" tab
2. Create example:
   - Name: "Premium Coffee Example"
   - Input: "What should a luxury coffee product title be?"
   - Output: "Handcrafted Espresso Excellence"
3. Click "Approve"
4. Go to "AI" tab
5. Select your example
6. Generate content
7. Notice the style matches your example

### Test Variations

1. Enter same prompt
2. Select variations count: 3
3. Click "Variations"
4. Wait for 3 variations
5. Compare all options
6. Use the best one

---

## 📈 Metrics & Analytics

### Usage Tracking

Examples track:
- How many times used
- Quality rating
- User feedback
- Approval status

### Performance Metrics

- Token usage per generation
- Average generation time
- Example effectiveness
- Content quality scores

---

## 🎨 Section-Specific AI

The AI has specialized prompts for each section type:

### Hero
- Focus on benefit-driven titles
- Attention-grabbing subtitles
- Power words included

### Features
- Benefit-first descriptions
- Specific details
- Action-oriented language

### Text
- Clear, persuasive writing
- Customer-focused benefits
- Problem-solution approach

### CTA
- Urgency and action
- Clear value proposition
- Strong call-to-action words

### Testimonial
- Authentic-sounding
- Specific benefits
- Quantified results

### Comparison
- Factual positioning
- Competitive advantages
- Clear differentiators

---

## 🔄 Workflow Example: Premium Headphones

### Step 1: Create Examples
- "Noise-canceling headphones with premium sound"
- "Revolutionary audio technology, wearable comfort"
- "Studio-quality sound for music lovers"

### Step 2: Generate Hero Title
- Prompt: "Create a catchy hero title for premium wireless headphones"
- Select: Premium headphone examples
- Result: AI generates luxury-focused title

### Step 3: Generate Features
- Prompt: "List key features with benefits"
- Select: Same examples
- Result: Benefit-focused features

### Step 4: Generate CTA
- Prompt: "Create urgency-focused call to action"
- Select: Examples
- Result: Persuasive CTA matching brand

### Step 5: Variations & Testing
- Generate 3 hero variations
- Test each with different audiences
- Keep best performer
- Update examples based on results

---

## 📚 Resources

### Documentation
- API Testing: `API_TESTING.md`
- Frontend Setup: `QUICK_START.md`
- Phase Completion: `PHASE_2_COMPLETE.md`

### Code Files
- **Backend Services**: `backend/src/services/aiService.js`
- **Backend Models**: `backend/src/models/AIExample.js`
- **Frontend Store**: `frontend/src/store/aiStore.js`
- **Frontend Components**: `frontend/src/components/AIGenerator.jsx`

---

## ⚠️ Limitations & Notes

### Current Limitations
- Max 5 variations per generation (to save tokens)
- Max 500 tokens per generation (can be customized)
- One API call per variation (not batched)
- Examples limited to approved only

### Future Enhancements
- Batch generation for multiple sections
- Image generation (DALL-E)
- Voice generation (TTS)
- Real-time feedback analysis
- ML model fine-tuning
- Collaborative example library

---

## 🆘 Troubleshooting

### "No API Key Error"
- Add `OPENAI_API_KEY` to `backend/.env`
- Restart backend server
- Check API key is valid

### "No Examples Available"
- Create examples in "Learn" tab
- Click "Approve" before use
- Refresh page

### "Slow Generation"
- Normal (network/API delay)
- Check OpenAI API status
- Consider using faster model

### "Token Error"
- Reduce prompt length
- Lower `maxTokens` setting
- Check OpenAI account balance

---

## 🎉 Summary

**Phase 3: AI Integration** is now complete with:

✅ OpenAI integration (GPT-4o-mini)
✅ Example-based learning system
✅ 11 AI API endpoints
✅ Content generation
✅ Variation generation (A/B testing)
✅ Example management
✅ Approval workflow
✅ Usage tracking
✅ Frontend UI complete
✅ 3-tab settings panel

**Total AI Code**: 500+ lines
**Total Endpoints**: 11
**Features**: 15+

---

**Ready for**: Phase 4 (Export & Shopify Integration)

Generated: October 25, 2025
