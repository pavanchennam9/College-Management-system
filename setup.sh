#!/bin/bash
echo "========================================="
echo "  EduNexus College Management System"
echo "  Setup Script"
echo "========================================="

# Install backend
echo ""
echo "📦 Installing backend dependencies..."
cd backend && npm install

# Seed database
echo ""
echo "🌱 Seeding demo data..."
node seed.js

echo ""
echo "✅ Backend ready!"
echo ""

# Install frontend
echo "📦 Installing frontend dependencies..."
cd ../frontend && npm install

echo ""
echo "✅ Frontend ready!"
echo ""
echo "========================================="
echo "  🚀 HOW TO START:"
echo "========================================="
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend && npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend && npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo ""
echo "Demo logins:"
echo "  Admin:   admin@college.edu   / admin123"
echo "  Faculty: faculty@college.edu / faculty123"
echo "  Student: student@college.edu / student123"
echo "========================================="
