const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  technologies: [String],
  imageUrl: String,
  liveUrl: String,
  githubUrl: String,
  category: { type: String, enum: ['fullstack', 'frontend', 'datascience', 'backend'] }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
