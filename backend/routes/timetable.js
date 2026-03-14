const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { department, semester } = req.query;
    let query = { isActive: true };
    if (department) query.department = department;
    if (semester) query.semester = parseInt(semester);
    const timetable = await Timetable.find(query).populate('course', 'name code').populate('faculty', 'name');
    res.json({ success: true, timetable });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const entry = await Timetable.create(req.body);
    res.status(201).json({ success: true, entry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Entry removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
