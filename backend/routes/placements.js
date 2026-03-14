const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Placement applications stored in memory / can be extended to MongoDB
const applications = [];

router.post('/apply', protect, async (req, res) => {
  try {
    const { companyId, companyName, role } = req.body;
    const existing = applications.find(a => a.student == req.user._id && a.companyId == companyId);
    if (existing) return res.status(400).json({ success: false, message: 'Already applied' });
    applications.push({ student: req.user._id, companyId, companyName, role, appliedAt: new Date() });
    res.json({ success: true, message: `Applied to ${companyName} successfully!` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/my-applications', protect, async (req, res) => {
  const myApps = applications.filter(a => a.student.toString() === req.user._id.toString());
  res.json({ success: true, applications: myApps });
});

module.exports = router;
