const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');
const Fee = require('../models/Fee');
const Notice = require('../models/Notice');
const { protect, authorize } = require('../middleware/auth');

router.get('/admin', protect, authorize('admin'), async (req, res) => {
  try {
    const [totalStudents, totalFaculty, totalCourses, pendingFees, recentNotices] = await Promise.all([
      User.countDocuments({ role: 'student', isActive: true }),
      User.countDocuments({ role: 'faculty', isActive: true }),
      Course.countDocuments({ isActive: true }),
      Fee.aggregate([{ $match: { status: { $in: ['pending', 'overdue'] } } }, { $group: { _id: null, total: { $sum: { $subtract: ['$amount', '$paidAmount'] } } } }]),
      Notice.find({ isActive: true }).sort({ createdAt: -1 }).limit(5).populate('postedBy', 'name')
    ]);
    res.json({ success: true, stats: { totalStudents, totalFaculty, totalCourses, pendingFees: pendingFees[0]?.total || 0, recentNotices } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/student', protect, async (req, res) => {
  try {
    const [attendanceSummary, grades, fees, notices] = await Promise.all([
      Attendance.find({ student: req.user._id }),
      Grade.find({ student: req.user._id }).populate('course', 'name code'),
      Fee.find({ student: req.user._id, status: { $in: ['pending', 'overdue'] } }),
      Notice.find({ isActive: true, $or: [{ targetAudience: 'all' }, { targetAudience: 'students' }] }).sort({ createdAt: -1 }).limit(3)
    ]);
    const totalClasses = attendanceSummary.length;
    const presentClasses = attendanceSummary.filter(a => a.status === 'present').length;
    const attendancePercentage = totalClasses ? ((presentClasses / totalClasses) * 100).toFixed(1) : 0;
    const cgpa = grades.length ? (grades.reduce((acc, g) => acc + g.gpa, 0) / grades.length).toFixed(2) : 0;
    const pendingFees = fees.reduce((acc, f) => acc + (f.amount - f.paidAmount), 0);
    res.json({ success: true, stats: { attendancePercentage, totalClasses, presentClasses, cgpa, totalGrades: grades.length, pendingFees, recentNotices: notices } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/faculty', protect, authorize('faculty'), async (req, res) => {
  try {
    const courses = await Course.find({ faculty: req.user._id, isActive: true });
    const totalStudents = courses.reduce((acc, c) => acc + c.students.length, 0);
    const notices = await Notice.find({ isActive: true }).sort({ createdAt: -1 }).limit(5).populate('postedBy', 'name');
    res.json({ success: true, stats: { totalCourses: courses.length, totalStudents, courses, recentNotices: notices } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
