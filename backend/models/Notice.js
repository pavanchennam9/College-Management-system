const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['general', 'academic', 'exam', 'event', 'urgent'], default: 'general' },
  targetAudience: { type: String, enum: ['all', 'students', 'faculty', 'admin'], default: 'all' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  expiryDate: { type: Date },
  attachments: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notice', noticeSchema);
