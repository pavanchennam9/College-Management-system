const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/faculty', require('./routes/faculty'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/grades', require('./routes/grades'));
app.use('/api/fees', require('./routes/fees'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/timetable', require('./routes/timetable'));
app.use('/api/placements', require('./routes/placements'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'College Management API Running', timestamp: new Date() });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected');
    // make sure the demo faculty name stays constant as requested
    try {
      const User = require('./models/User');
      await User.findOneAndUpdate(
        { email: 'faculty@college.edu' },
        { $set: { name: 'Prof. BNR' } }
      );
    } catch (e) {
      console.warn('could not enforce faculty name:', e.message);
    }

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;
