# AI Product Description Generation - Guidelines & Rules

## Section Selection Rules

### Hero Section (type: 'hero')
- **RARELY USED** for first block
- Only use when product has extremely strong brand recognition or unique value proposition
- Example use case: "Premium brand launch" or "Unique differentiator"

### Two Column Section (type: 'twoColumn')
- **MOST COMMON** for introduction/first block
- Left side: Rich text with H2 heading + intro paragraph
- Right side: Product image
- Pattern: Introduction heading (H2) → Benefits paragraph → Image
- Example structure:
  ```
  leftText: "<h2>Secondary Keyword Heading</h2><p>Intro paragraph explaining what product does</p>"
  rightImage: {url}
  ```

### Gallery Section (type: 'gallery')
- **NEVER** use for just displaying product pictures without context
- **ONLY** use when:
  - Product has add-ons/accessories (3-4 items)
  - Each image corresponds to specific add-on
  - Description explains each add-on/accessory below images
- Alternative: Use multiple twoColumn sections for product features with images

### Features Section (type: 'features')
- Use for listing key features with benefits
- Each feature must map to a customer benefit
- Format: Feature title → Benefit description
- Example: "360° Perforated steel intake housing: Drawing air into all sides of the purifier, it then passes through the four-stage filtration process. With a high-velocity airflow, it can create a pocket of clean air around you."

### Comparison/Spec Table (type: 'comparison')
- ALWAYS include if product has technical specs in supplier description
- Map technical specs to benefits when possible

### Text Section (type: 'text')
- Use for detailed explanations
- Rich text format allows multiple paragraphs
- Good for "How it works" explanations

### CTA Section (type: 'cta')
- Use at end of description
- Highlight purchase call-to-action

## Content Structure - 5 Stages (Internal)

**Note: Stages are for AI generation flow - NOT shown to user as "stages"**

### Stage 1: Problem Identification
- **Purpose**: Identify biggest problem product solves
- **Process**:
  1. Analyze product title + supplier description
  2. Generate 2-3 potential problems
  3. **ASK USER**: "What's the biggest problem this product solves?" + show suggestions
  4. Wait for user confirmation
- **Output**: Customer avatar + problem statement
- **Example**: "Workshop enthusiast needs organized storage" or "Family needs outdoor heating for gatherings"

### Stage 2: Solution Explanation
- **Purpose**: Explain HOW product solves the problem
- **Process**:
  1. Generate explanation based on problem from Stage 1
  2. Use product features to show solution mechanism
  3. **AI CRITIQUE**: Check if explanation is clear and logical
  4. **ASK USER**: "Does this solution explanation work?" + show critique
- **Output**: Solution narrative paragraph
- **Keywords**: Must include 1 secondary keyword in this section

### Stage 3: Features → Benefits Mapping
- **Purpose**: Convert each feature into customer benefit
- **Process**:
  1. List all features from supplier description
  2. For EACH feature, write benefit statement
  3. **AI CRITIQUE**: Check if all features have benefits
  4. **ASK USER**: "Are these feature benefits clear?" + show critique
- **Output**: Features list with benefit descriptions
- **Keywords**: Use secondary keywords in feature headings
- **Format Example**:
  - "360° Air Intake → Creates pocket of clean air around you"
  - "HEPA Filter → Removes 99.97% of particles for healthier breathing"

### Stage 4: Technical Specifications
- **Purpose**: Show specs and explain how they solve problem
- **Process**:
  1. Extract all specs from supplier description
  2. Explain how each spec contributes to solving problem
  3. Create comparison table if multiple metrics
  4. **AI CRITIQUE**: Check if specs tie back to problem
  5. **ASK USER**: "Do specs clearly support the solution?" + show critique
- **Output**: Spec table + explanatory text
- **Keywords**: Include secondary keywords in spec section heading

### Stage 5: Conclusion + CTA
- **Purpose**: Wrap up and encourage purchase
- **Process**:
  1. Summarize key benefits
  2. Reinforce problem → solution
  3. Strong call-to-action
  4. **AI CRITIQUE**: Check if conclusion is compelling
  5. **ASK USER**: "Ready to proceed with section generation?" + show critique
- **Output**: Conclusion paragraph with CTA
- **Keywords**: Include main product keyword in conclusion

## Secondary Keywords Rules

### What are Secondary Keywords?
- Shortened or alternative versions of main product keyword
- Example: "Austin Air HealthMate Plus Air Purifier" →
  - "HealthMate Plus Air"
  - "HealthMate Plus Air Purifier's"
  - "Austin Air HealthMate Plus HM450"
  - "Austin Air Purifier"

### Where to Use Keywords
1. **H2 Headings** - MUST include secondary keyword in every H2
2. **Section titles** - Use variations to avoid repetition
3. **Alt text** - Every image alt text must include secondary keyword + product description
4. **Naturally integrated** - Don't force keyword stuffing

### Keyword Distribution
- Stage 1 (Problem): 1 keyword in heading
- Stage 2 (Solution): 1 keyword in heading
- Stage 3 (Features): 2-3 keywords across feature titles
- Stage 4 (Specs): 1 keyword in heading
- Stage 5 (Conclusion): Main keyword once

## Image to Field Mapping Rules

### Two Column Sections
- Field: `rightImage` (URL string)
- Alt text: `{secondary_keyword} - {product_description}`
- Example: "HealthMate Plus Air Purifier - HEPA filtration system removing airborne particles"

### Gallery Sections
- Field: `images` (array of objects)
- Structure:
  ```javascript
  images: [
    {url: "...", alt: "{secondary_keyword} - {accessory_name}"},
    {url: "...", alt: "{secondary_keyword} - {accessory_name}"}
  ]
  ```

### Image Section (single)
- Field: `url` (string) and `altText` (string)
- Alt text: Full description with keyword

### Feature Sections with Icons
- Field: `icon` (URL string) per feature
- Optional but recommended for visual features

## Content Quality Criteria

### Feature → Benefit Format
✅ Good: "360° Perforated steel intake: Creates clean air pocket around you by drawing air from all sides"
❌ Bad: "360° Perforated steel intake housing"

### Customer Avatar Examples
- "Workshop enthusiast organizing new space"
- "Family gathering outdoors needing warmth"
- "Individual with chemical sensitivities seeking pure air"

### H2 Heading Examples
✅ Good: "How the HealthMate Plus Purifier Cleans Your Air"
✅ Good: "Key Features of the Austin Air System"
❌ Bad: "Features" (no keyword)
❌ Bad: "Product Information" (generic)

## Self-Critique Checklist

After generating each stage, AI must check:
1. ✓ Secondary keyword included in heading?
2. ✓ Features have corresponding benefits?
3. ✓ Content addresses the problem from Stage 1?
4. ✓ Language is clear and customer-focused (not technical jargon)?
5. ✓ Natural flow and readability?
6. ✓ No keyword stuffing?

## Evaluation Criteria (Post-Generation)

### Eval 1: Alt Text Quality
- Check: Does every image have alt text?
- Check: Does alt text include secondary keyword?
- Check: Does alt text describe the image?
- Format: "{keyword} - {description}"

### Eval 2: Keyword Coverage
- Check: Does every H2 heading include a secondary keyword?
- Check: Are keywords naturally distributed (not stuffed)?
- Check: Minimum 1 keyword per stage/section

### Eval 3: Feature-Benefit Mapping
- Check: Does every feature have a benefit statement?
- Check: Are benefits customer-focused (not just technical specs)?

## Special Cases

### Links to Documents
- If manual/installation guide URLs provided, include in dedicated text section
- Format: "📄 [Installation Manual](URL) | [Product Specifications](URL)"

### Spec Tables
- If supplier description has specs in table format, preserve table structure
- Add explanatory text above/below table
- Connect specs to problem-solution narrative

### Video Embeds
- If YouTube embed provided, consider using in solution explanation section
- Video alt text should follow same keyword rules

## Section Generation Priority Order

Based on content generated in 5 stages, map to sections:

1. **twoColumn** (Introduction) - Use Stage 1 + 2 content
2. **features** - Use Stage 3 content
3. **text** or **twoColumn** - Use Stage 2 (How it works)
4. **comparison** - Use Stage 4 content (if specs exist)
5. **text** - Use Stage 4 explanatory content
6. **cta** - Use Stage 5 content
7. **gallery** - Only if add-ons/accessories detected

## Example Workflow

1. User inputs: Title, description, 3 images, manual URL
2. Generate secondary keywords → User selects
3. Stage 1: Detect problem is "indoor air quality" → Ask user to confirm
4. Generate Stage 1 content → AI critiques → User approves
5. Generate Stage 2 content → AI critiques → User approves
6. Generate Stage 3 content → AI critiques → User approves
7. Generate Stage 4 content → AI critiques → User approves
8. Generate Stage 5 content → AI critiques → User approves
9. Map content to sections: twoColumn → features → text → comparison → cta
10. Assign images with keyword-rich alt text
11. Run evals: Check alt text + keywords
12. Show results with any issues flagged
13. User selects sections to add to canvas
