const express = require('express');
const router = express.Router();
const Grade = require('../models/Grade');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const grade = await Grade.create({ ...req.body, gradedBy: req.user._id });
    res.status(201).json({ success: true, grade });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/student/:studentId', protect, async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.params.studentId }).populate('course', 'name code credits');
    const avgGpa = grades.length ? (grades.reduce((acc, g) => acc + g.gpa, 0) / grades.length).toFixed(2) : 0;
    res.json({ success: true, grades, cgpa: avgGpa });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/course/:courseId', protect, async (req, res) => {
  try {
    const grades = await Grade.find({ course: req.params.courseId }).populate('student', 'name rollNumber');
    res.json({ success: true, grades });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/my', protect, async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.user._id }).populate('course', 'name code credits');
    const cgpa = grades.length ? (grades.reduce((acc, g) => acc + g.gpa, 0) / grades.length).toFixed(2) : 0;
    res.json({ success: true, grades, cgpa });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', protect, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const grade = await Grade.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, grade });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
