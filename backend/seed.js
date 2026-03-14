const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Course = require('./models/Course');
const Notice = require('./models/Notice');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing demo data
    await User.deleteMany({ email: { $in: ['admin@college.edu', 'faculty@college.edu', 'student@college.edu'] } });
    
    // Create demo users
    const admin = await User.create({
      name: 'Salaar', email: 'admin@college.edu', password: 'admin123',
      role: 'admin', department: 'Administration', phone: '+91 98765 00001'
    });

    const faculty = await User.create({
      // changed per request – this name will appear every time the demo data is reseeded
      name: 'Prof. BNR', email: 'faculty@college.edu', password: 'faculty123',
      role: 'faculty', department: 'Computer Science', employeeId: 'FAC001', phone: '+91 98765 00002'
    });

    const students = await User.create([{
      name: 'Arjun Patel', email: 'student@college.edu', password: 'student123',
      role: 'student', department: 'Computer Science', semester: 3,
      rollNumber: '2023CS001', phone: '+91 98765 00003'
    }, {
      name: 'Sneha Kumar', email: 'sneha@college.edu', password: 'student123',
      role: 'student', department: 'Computer Science', semester: 3,
      rollNumber: '2023CS002', phone: '+91 98765 00004'
    }, {
      name: 'Rohit Singh', email: 'rohit@college.edu', password: 'student123',
      role: 'student', department: 'Computer Science', semester: 3,
      rollNumber: '2023CS003', phone: '+91 98765 00005'
    }]);

    // Create demo course with multiple students enrolled
    const course = await Course.create({
      name: 'Data Structures & Algorithms', code: 'CS301', department: 'Computer Science',
      semester: 3, credits: 4, faculty: faculty._id,
      students: students.map(s => s._id), description: 'Fundamental data structures and algorithm design',
      maxStudents: 60
    });

    // Create demo notices
    await Notice.create([
      { title: 'Welcome to EduNexus 2024-25!', content: 'Welcome to the new semester. Please check your timetable and course enrollments.', category: 'general', targetAudience: 'all', postedBy: admin._id },
      { title: 'Mid-Term Exams Schedule Released', content: 'Mid-term examinations will be held from 15th October 2024. Please check the exam portal for detailed schedules.', category: 'exam', targetAudience: 'students', postedBy: admin._id },
      { title: 'Faculty Meeting - October 10th', content: 'All faculty members are requested to attend the departmental meeting on October 10th at 2 PM in Conference Hall A.', category: 'general', targetAudience: 'faculty', postedBy: admin._id },
    ]);

    console.log('✅ Demo data seeded successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('  Admin:   admin@college.edu    / admin123');
    console.log('  Faculty: faculty@college.edu  / faculty123');
    console.log('  Student: student@college.edu  / student123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
