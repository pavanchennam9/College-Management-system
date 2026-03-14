const express = require('express');
const router = express.Router();
const Fee = require('../models/Fee');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const fee = await Fee.create(req.body);
    res.status(201).json({ success: true, fee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/my', protect, async (req, res) => {
  try {
    const fees = await Fee.find({ student: req.user._id }).sort({ dueDate: -1 });
    const pending = fees.filter(f => f.status !== 'paid').reduce((acc, f) => acc + (f.amount - f.paidAmount), 0);
    res.json({ success: true, fees, totalPending: pending });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/student/:studentId', protect, authorize('admin'), async (req, res) => {
  try {
    const fees = await Fee.find({ student: req.params.studentId }).sort({ dueDate: -1 });
    res.json({ success: true, fees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id/pay', protect, authorize('admin'), async (req, res) => {
  try {
    const { paidAmount, paymentMode, transactionId } = req.body;
    const fee = await Fee.findById(req.params.id);
    fee.paidAmount += paidAmount;
    fee.paidDate = new Date();
    fee.paymentMode = paymentMode;
    fee.transactionId = transactionId;
    fee.status = fee.paidAmount >= fee.amount ? 'paid' : 'partial';
    await fee.save();
    res.json({ success: true, fee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/summary', protect, authorize('admin'), async (req, res) => {
  try {
    const total = await Fee.aggregate([{ $group: { _id: '$status', count: { $sum: 1 }, amount: { $sum: '$amount' } } }]);
    res.json({ success: true, summary: total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
