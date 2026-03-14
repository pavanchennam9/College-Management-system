const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// GET all students (admin/faculty)
router.get('/', protect, authorize('admin', 'faculty'), async (req, res) => {
  try {
    const { department, semester, search } = req.query;
    let query = { role: 'student', isActive: true };
    if (department) query.department = department;
    if (semester) query.semester = parseInt(semester);
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }, { rollNumber: new RegExp(search, 'i') }];
    const students = await User.find(query).select('-password').sort({ name: 1 });
    res.json({ success: true, count: students.length, students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single student
router.get('/:id', protect, async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password');
    if (!student || student.role !== 'student') return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update student (admin)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const student = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE student (admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Student deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
