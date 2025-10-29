import mongoose from 'mongoose';

/**
 * AI Example Model
 * Stores examples for training the AI to generate better content
 */

const exampleSchema = new mongoose.Schema(
  {
    // Basic information
    name: {
      type: String,
      required: [true, 'Example name is required'],
      trim: true,
      minlength: [1, 'Name must be at least 1 character'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    // Example categorization
    sectionType: {
      type: String,
      required: [true, 'Section type is required'],
      enum: {
        values: ['hero', 'text', 'features', 'cta', 'testimonial', 'comparison', 'gallery', 'image'],
        message: 'Invalid section type',
      },
    },

    category: {
      type: String,
      enum: {
        values: ['tech', 'fashion', 'home', 'beauty', 'sports', 'general'],
        message: 'Invalid category',
      },
      default: 'general',
    },

    // Example content
    input: {
      type: String,
      required: [true, 'Input/prompt is required'],
      minlength: [5, 'Input must be at least 5 characters'],
      maxlength: [1000, 'Input cannot exceed 1000 characters'],
    },

    output: {
      type: String,
      required: [true, 'Output/result is required'],
      minlength: [5, 'Output must be at least 5 characters'],
      maxlength: [2000, 'Output cannot exceed 2000 characters'],
    },

    // Additional metadata
    note: {
      type: String,
      maxlength: [500, 'Note cannot exceed 500 characters'],
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    // Quality metrics
    quality: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 3,
      },
      feedback: String,
      isApproved: {
        type: Boolean,
        default: false,
      },
    },

    // Usage tracking
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Effectiveness metrics
    effectiveness: {
      conversions: {
        type: Number,
        default: 0,
      },
      clicks: {
        type: Number,
        default: 0,
      },
      impressions: {
        type: Number,
        default: 0,
      },
      score: {
        type: Number,
        min: 0,
        max: 100,
      },
    },

    // Owner information
    createdBy: String,
    isPublic: {
      type: Boolean,
      default: false,
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
exampleSchema.index({ sectionType: 1, category: 1 });
exampleSchema.index({ tags: 1 });
exampleSchema.index({ 'quality.isApproved': 1 });
exampleSchema.index({ usageCount: -1 });
exampleSchema.index({ createdAt: -1 });

// Instance methods
exampleSchema.methods.incrementUsage = function () {
  this.usageCount += 1;
  return this.save();
};

exampleSchema.methods.updateEffectiveness = function (clicks, impressions) {
  this.effectiveness.clicks += clicks;
  this.effectiveness.impressions += impressions;
  if (impressions > 0) {
    this.effectiveness.conversions = Math.round((this.effectiveness.clicks / impressions) * 100);
  }
  return this.save();
};

exampleSchema.methods.approve = function (feedback = '') {
  this.quality.isApproved = true;
  if (feedback) {
    this.quality.feedback = feedback;
  }
  return this.save();
};

// Static methods
exampleSchema.statics.findByType = function (sectionType) {
  return this.find({ sectionType, 'quality.isApproved': true });
};

exampleSchema.statics.findByCategory = function (category) {
  return this.find({ category, 'quality.isApproved': true });
};

exampleSchema.statics.findByTypeAndCategory = function (sectionType, category) {
  return this.find({ sectionType, category, 'quality.isApproved': true });
};

exampleSchema.statics.findMostUsed = function (limit = 10) {
  return this.find({ 'quality.isApproved': true })
    .sort({ usageCount: -1 })
    .limit(limit);
};

exampleSchema.statics.findTopPerforming = function (limit = 10) {
  return this.find({ 'quality.isApproved': true })
    .sort({ 'effectiveness.score': -1 })
    .limit(limit);
};

exampleSchema.statics.findBySearch = function (searchTerm) {
  return this.find({
    'quality.isApproved': true,
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { input: { $regex: searchTerm, $options: 'i' } },
      { output: { $regex: searchTerm, $options: 'i' } },
      { tags: { $in: [new RegExp(searchTerm, 'i')] } },
    ],
  });
};

export default mongoose.model('AIExample', exampleSchema);
