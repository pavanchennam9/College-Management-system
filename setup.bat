@echo off
echo =========================================
echo   EduNexus College Management System
echo   Setup Script (Windows)
echo =========================================

echo.
echo Installing backend dependencies...
cd backend
npm install

echo.
echo Seeding demo data...
node seed.js
cd ..

echo.
echo Installing frontend dependencies...
cd frontend
npm install
cd ..

echo.
echo =========================================
echo   SETUP COMPLETE! HOW TO START:
echo =========================================
echo.
echo Open TWO terminals:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   npm run dev
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm run dev
echo.
echo Then open: http://localhost:5173
echo.
echo Demo logins:
echo   Admin:   admin@college.edu   / admin123
echo   Faculty: faculty@college.edu / faculty123
echo   Student: student@college.edu / student123
echo =========================================
pause
