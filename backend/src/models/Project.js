import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  order: { type: Number, required: true },
  config: { type: mongoose.Schema.Types.Mixed, default: {} },
  content: { type: mongoose.Schema.Types.Mixed, default: {} },
  styles: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { _id: false });

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    minlength: [1, 'Project name must be at least 1 character'],
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  sections: [sectionSchema],
  brandColors: [{
    type: String,
    match: [/^#[0-9A-Fa-f]{6}$/, 'Invalid color format. Use hex colors (e.g., #3B82F6)']
  }],
  typography: {
    headingFont: {
      type: String,
      default: 'Inter'
    },
    bodyFont: {
      type: String,
      default: 'Inter'
    }
  },
  isDraft: {
    type: Boolean,
    default: true
  },
  lastExportedAt: Date,
  metadata: {
    sectionCount: {
      type: Number,
      default: 0
    },
    estimatedRenderTime: Number
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
projectSchema.index({ createdAt: -1 });
projectSchema.index({ updatedAt: -1 });
projectSchema.index({ name: 'text', description: 'text' });

// Virtual for section count
projectSchema.virtual('totalSections').get(function() {
  return this.sections.length;
});

// Pre-save middleware to update metadata
projectSchema.pre('save', function(next) {
  if (this.sections) {
    this.metadata.sectionCount = this.sections.length;
  }
  next();
});

// Instance methods
projectSchema.methods.addSection = function(section, index = null) {
  if (index !== null && index <= this.sections.length) {
    this.sections.splice(index, 0, section);
  } else {
    this.sections.push(section);
  }
  this.updateSectionOrder();
  return this;
};

projectSchema.methods.removeSection = function(sectionId) {
  this.sections = this.sections.filter(s => s.id !== sectionId);
  this.updateSectionOrder();
  return this;
};

projectSchema.methods.updateSectionOrder = function() {
  this.sections.forEach((section, index) => {
    section.order = index;
  });
};

projectSchema.methods.reorderSections = function(fromIndex, toIndex) {
  const section = this.sections.splice(fromIndex, 1)[0];
  this.sections.splice(toIndex, 0, section);
  this.updateSectionOrder();
  return this;
};

projectSchema.methods.duplicateSection = function(sectionId) {
  const sectionIndex = this.sections.findIndex(s => s.id === sectionId);
  if (sectionIndex !== -1) {
    const originalSection = this.sections[sectionIndex];
    const duplicatedSection = {
      ...originalSection,
      id: `${originalSection.id}_copy_${Date.now()}`
    };
    this.sections.splice(sectionIndex + 1, 0, duplicatedSection);
    this.updateSectionOrder();
    return duplicatedSection;
  }
  return null;
};

// Static methods
projectSchema.statics.findByNameRegex = function(searchTerm) {
  return this.find({
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } }
    ]
  });
};

export default mongoose.model('Project', projectSchema);
