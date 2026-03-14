const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: String, required: true },
  semester: { type: Number, required: true },
  dayOfWeek: { type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  room: { type: String, required: true },
  type: { type: String, enum: ['lecture', 'lab', 'tutorial'], default: 'lecture' },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Timetable', timetableSchema);
