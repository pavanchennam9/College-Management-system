const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { protect, authorize } = require('../middleware/auth');

// Mark attendance (faculty/admin)
router.post('/', protect, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const { courseId, date, records } = req.body; // records: [{studentId, status}]
    const ops = records.map(r => ({
      updateOne: {
        filter: { course: courseId, student: r.studentId, date: new Date(date) },
        update: { $set: { status: r.status, markedBy: req.user._id } },
        upsert: true
      }
    }));
    await Attendance.bulkWrite(ops);
    res.json({ success: true, message: 'Attendance marked' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get attendance for a course
router.get('/course/:courseId', protect, async (req, res) => {
  try {
    const { date, studentId } = req.query;
    let query = { course: req.params.courseId };
    if (date) query.date = new Date(date);
    if (studentId) query.student = studentId;
    const attendance = await Attendance.find(query).populate('student', 'name rollNumber').sort({ date: -1 });
    res.json({ success: true, attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get my attendance (student)
router.get('/my', protect, async (req, res) => {
  try {
    const attendance = await Attendance.find({ student: req.user._id }).populate('course', 'name code');
    const summary = {};
    attendance.forEach(a => {
      const key = a.course._id;
      if (!summary[key]) summary[key] = { course: a.course, total: 0, present: 0, absent: 0, late: 0 };
      summary[key].total++;
      summary[key][a.status]++;
    });
    const result = Object.values(summary).map(s => ({ ...s, percentage: ((s.present + s.late * 0.5) / s.total * 100).toFixed(1) }));
    res.json({ success: true, summary: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
