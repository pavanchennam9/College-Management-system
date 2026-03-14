const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const query = { isActive: true, $or: [{ targetAudience: 'all' }, { targetAudience: req.user.role + 's' }, { targetAudience: req.user.role }] };
    const notices = await Notice.find(query).populate('postedBy', 'name role').sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, notices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', protect, authorize('admin', 'faculty'), async (req, res) => {
  try {
    const notice = await Notice.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json({ success: true, notice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', protect, authorize('admin', 'faculty'), async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, notice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Notice.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Notice removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
