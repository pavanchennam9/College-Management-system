const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { department, search } = req.query;
    let query = { role: 'faculty', isActive: true };
    if (department) query.department = department;
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { employeeId: new RegExp(search, 'i') }];
    const faculty = await User.find(query).select('-password').sort({ name: 1 });
    res.json({ success: true, count: faculty.length, faculty });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const member = await User.findById(req.params.id).select('-password');
    if (!member || member.role !== 'faculty') return res.status(404).json({ success: false, message: 'Faculty not found' });
    res.json({ success: true, faculty: member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const member = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json({ success: true, faculty: member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
