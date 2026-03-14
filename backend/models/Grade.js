const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  semester: { type: Number, required: true },
  examType: { type: String, enum: ['internal', 'midterm', 'final', 'assignment'], required: true },
  marksObtained: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  grade: { type: String },      // O, A+, A, B+, B, C, F
  gradePoints: { type: Number }, // 10, 9, 8, 7, 6, 5, 0
  remarks: { type: String },
  gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  gradedAt: { type: Date, default: Date.now }
});

// B.Tech 10-point grade scale (JNTUH/VTU/Anna University compatible)
gradeSchema.pre('save', function(next) {
  const pct = (this.marksObtained / this.totalMarks) * 100;
  if (pct >= 90)      { this.grade = 'O';  this.gradePoints = 10; }
  else if (pct >= 80) { this.grade = 'A+'; this.gradePoints = 9; }
  else if (pct >= 70) { this.grade = 'A';  this.gradePoints = 8; }
  else if (pct >= 60) { this.grade = 'B+'; this.gradePoints = 7; }
  else if (pct >= 50) { this.grade = 'B';  this.gradePoints = 6; }
  else if (pct >= 45) { this.grade = 'C';  this.gradePoints = 5; }
  else                { this.grade = 'F';  this.gradePoints = 0; }
  next();
});

module.exports = mongoose.model('Grade', gradeSchema);
