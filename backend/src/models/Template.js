import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Template name is required'],
    trim: true,
    minlength: [1, 'Template name must be at least 1 character'],
    maxlength: [100, 'Template name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Template description is required'],
    trim: true,
    minlength: [1, 'Description must be at least 1 character'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  thumbnail: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: {
      values: ['tech', 'fashion', 'home', 'beauty', 'sports', 'general'],
      message: 'Category must be one of: tech, fashion, home, beauty, sports, general'
    },
    default: 'general'
  },
  sections: [{
    type: mongoose.Schema.Types.Mixed
  }],
  brandColors: [{
    type: String,
    match: [/^#[0-9A-Fa-f]{6}$/, 'Invalid color format. Use hex colors (e.g., #3B82F6)']
  }],
  isPrebuilt: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  usageCount: {
    type: Number,
    default: 0,
    min: 0
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
templateSchema.index({ category: 1 });
templateSchema.index({ isPrebuilt: 1 });
templateSchema.index({ isFeatured: 1 });
templateSchema.index({ usageCount: -1 });
templateSchema.index({ name: 'text', description: 'text' });

// Virtual for section count
templateSchema.virtual('sectionCount').get(function() {
  return this.sections ? this.sections.length : 0;
});

// Instance methods
templateSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  return this.save();
};

templateSchema.methods.toggleFeatured = function() {
  this.isFeatured = !this.isFeatured;
  return this.save();
};

// Static methods
templateSchema.statics.findByCategory = function(category) {
  return this.find({ category });
};

templateSchema.statics.findFeatured = function() {
  return this.find({ isFeatured: true }).sort({ usageCount: -1 });
};

templateSchema.statics.findPrebuilt = function() {
  return this.find({ isPrebuilt: true }).sort({ usageCount: -1 });
};

templateSchema.statics.searchByName = function(searchTerm) {
  return this.find({
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { tags: { $in: [new RegExp(searchTerm, 'i')] } }
    ]
  });
};

templateSchema.statics.getMostPopular = function(limit = 10) {
  return this.find()
    .sort({ usageCount: -1 })
    .limit(limit);
};

export default mongoose.model('Template', templateSchema);
