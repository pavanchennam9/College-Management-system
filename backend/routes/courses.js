const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { department, semester, faculty, all } = req.query;
    let query = { isActive: true };

    // if a faculty user hits this endpoint, only return courses assigned to them
    // unless the client explicitly requests every course (all=true)
    if (req.user.role === 'faculty' && !all) query.faculty = req.user._id;
    // allow explicit faculty query (admin or others)
    if (faculty) query.faculty = faculty;

    if (department) query.department = department;
    if (semester) query.semester = parseInt(semester);

    const courses = await Course.find(query).populate('faculty', 'name email').sort({ name: 1 });
    res.json({ success: true, count: courses.length, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('faculty', 'name email').populate('students', 'name email rollNumber');
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    // ensure faculty assigned if students are being enrolled
    if (Array.isArray(req.body.students) && req.body.students.length > 0 && !req.body.faculty) {
      return res.status(400).json({ success: false, message: 'Assign a faculty before enrolling students' });
    }
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', protect, authorize('admin', 'faculty'), async (req, res) => {
  try {
    // if students are provided make sure faculty is set
    if (Array.isArray(req.body.students) && req.body.students.length > 0 && !req.body.faculty) {
      return res.status(400).json({ success: false, message: 'Assign a faculty before enrolling students' });
    }
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/:id/enroll', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    // only admin or assigned faculty may modify enrollment
    if (req.user.role === 'faculty' && (!course.faculty || course.faculty.toString() !== req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Not allowed to enroll students' });
    }

    // admin/faculty can enroll multiple students by sending array
    if (Array.isArray(req.body.studentIds)) {
      const toAdd = req.body.studentIds.filter(id => !course.students.includes(id));
      if (toAdd.length) {
        course.students.push(...toAdd);
        await course.save();
      }
      return res.json({ success: true, message: 'Students added', course });
    }

    // otherwise self-enroll (student)
    if (course.students.includes(req.user._id)) return res.status(400).json({ success: false, message: 'Already enrolled' });
    course.students.push(req.user._id);
    await course.save();
    res.json({ success: true, message: 'Enrolled successfully', course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// helper for removing a student (admin or assigned faculty)
router.post('/:id/unenroll', protect, async (req, res) => {
  try {
    const { studentIds } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    if (req.user.role === 'faculty' && (!course.faculty || course.faculty.toString() !== req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Not allowed to remove students' });
    }

    if (Array.isArray(studentIds)) {
      course.students = course.students.filter(s => !studentIds.includes(s.toString()));
      await course.save();
    }
    res.json({ success: true, message: 'Students removed', course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
