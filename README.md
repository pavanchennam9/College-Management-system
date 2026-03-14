# 🎓 EduNexus — College Management System v2.0

**Full-Stack | React + Node.js + MongoDB | Dark Neon UI**

---

## 📁 VS CODE FOLDER STRUCTURE

```
EduNexus/
├── 📂 backend/                    ← Node.js + Express API
│   ├── 📂 models/                 ← MongoDB Mongoose Schemas
│   │   ├── User.js                (Admin, Faculty, Student)
│   │   ├── Course.js              (Courses + Enrollment)
│   │   ├── Attendance.js          (Attendance Records)
│   │   ├── Grade.js               (B.Tech 10-pt Scale)
│   │   ├── Fee.js                 (Fee Records)
│   │   ├── Notice.js              (Announcements)
│   │   └── Timetable.js           (Weekly Schedule)
│   ├── 📂 routes/                 ← Express API Endpoints
│   │   ├── auth.js                (Login/Register/JWT)
│   │   ├── students.js
│   │   ├── faculty.js
│   │   ├── courses.js
│   │   ├── attendance.js
│   │   ├── grades.js
│   │   ├── fees.js
│   │   ├── notices.js
│   │   ├── timetable.js
│   │   ├── placements.js          (NEW: Applications)
│   │   └── dashboard.js
│   ├── 📂 middleware/
│   │   └── auth.js                (JWT Protect + Authorize)
│   ├── .env                       ← EDIT THIS with your MongoDB URI
│   ├── server.js                  ← Entry Point (port 5000)
│   ├── seed.js                    ← Demo Data Seeder
│   └── package.json
│
├── 📂 frontend/                   ← React 18 + Vite
│   ├── 📂 public/
│   │   └── logo.jpeg              ← EduNexus Logo (splash + sidebar)
│   └── 📂 src/
│       ├── 📂 components/
│       │   ├── Layout.jsx          (Sidebar + Header)
│       │   └── SplashScreen.jsx    (3-sec Logo Intro)
│       ├── 📂 context/
│       │   └── AuthContext.jsx     (JWT Auth State)
│       ├── 📂 pages/
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── 📂 admin/
│       │   │   ├── Dashboard.jsx
│       │   │   ├── Students.jsx    (CRUD + Search)
│       │   │   ├── Faculty.jsx
│       │   │   ├── Courses.jsx
│       │   │   └── Fees.jsx        (Record + Pay)
│       │   ├── 📂 faculty/
│       │   │   ├── Dashboard.jsx
│       │   │   ├── Attendance.jsx  (Mark per Course)
│       │   │   └── Grades.jsx      (Enter Grades)
│       │   ├── 📂 student/
│       │   │   ├── Dashboard.jsx   (Stats + Attendance Ring)
│       │   │   ├── Grades.jsx      (CGPA with Credits)
│       │   │   ├── Attendance.jsx  (Per-Course Summary)
│       │   │   └── Fees.jsx        (Fee Records)
│       │   └── 📂 shared/
│       │       ├── Notices.jsx     (Post + View)
│       │       ├── Timetable.jsx   (Weekly Grid)
│       │       ├── Placements.jsx  (30 Companies + Apply)
│       │       └── Profile.jsx     (Edit + Change Password)
│       ├── 📂 utils/
│       │   └── api.js              (Axios + interceptors)
│       ├── App.jsx                 (Routes + Splash Gate)
│       ├── main.jsx
│       ├── index.css               (Dark Neon Design System)
│       └── index.html
│   ├── package.json
│   └── vite.config.js
│
├── setup.bat                      ← Windows setup script
├── setup.sh                       ← Mac/Linux setup script
└── README.md
```

---

## 🚀 HOW TO RUN (Step by Step)

### Prerequisites
- **Node.js** v18+ → https://nodejs.org
- **MongoDB** → https://www.mongodb.com/try/download/community (OR use free MongoDB Atlas)
- **VS Code** → https://code.visualstudio.com

---

### Option A: Windows (.bat)
```
Double-click setup.bat
```

### Option B: Mac/Linux
```bash
chmod +x setup.sh
./setup.sh
```

### Option C: Manual Commands

**Step 1 — Start MongoDB**
```bash
# Local MongoDB
mongod

# OR use MongoDB Atlas (cloud) — update .env with your connection string
```

**Step 2 — Setup Backend**
```bash
cd backend
npm install
node seed.js        # Creates demo accounts + sample data
npm run dev         # Starts on http://localhost:5000
```

**Step 3 — Setup Frontend** (New terminal)
```bash
cd frontend
npm install
npm run dev         # Opens http://localhost:5173
```

**Step 4 — Open Browser**
```
http://localhost:5173
```

---

## 🔑 Demo Login Credentials

| Role    | Email                      | Password    |
|---------|---------------------------|-------------|
| 👑 Admin   | admin@college.edu       | admin123    |
| 👩‍🏫 Faculty | faculty@college.edu     | faculty123  |
| 🎓 Student | student@college.edu     | student123  |

---

## ⚙️ Configuration (backend/.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/college_management
JWT_SECRET=your_very_secret_key_here
JWT_EXPIRE=7d
```

**For MongoDB Atlas (cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/college_mgmt
```

---

## ✨ Features

| Module | Admin | Faculty | Student |
|--------|-------|---------|---------|
| Dashboard | ✅ Stats | ✅ Courses | ✅ CGPA + Attendance |
| Splash Screen | ✅ Logo 3s | ✅ | ✅ |
| Students | ✅ CRUD | 👁 View | — |
| Faculty | ✅ CRUD | — | — |
| Courses | ✅ Manage | 👁 Assigned | 👁 Enrolled |
| Attendance | ✅ View | ✅ Mark | ✅ My % |

⚙️ **Notes:**
- Admins can enroll multiple students into any course through the courses page modal.  Faculty members or admins may now mark attendance for *any* course (not just the one they're assigned) by selecting from the full course list.  The backend accepts an `all=true` query param to return every active course for faculty users.
| Grades | ✅ All | ✅ Enter | ✅ CGPA/SGPA |
| CGPA System | — | — | ✅ B.Tech 10-pt |
| Fees | ✅ Manage | — | ✅ My Fees |
| Placements | ✅ | ✅ | ✅ Apply |
| Notices | ✅ Post+Delete | ✅ Post | 👁 View |
| Timetable | ✅ Add+Delete | 👁 View | 👁 View |
| Profile | ✅ Edit | ✅ Edit | ✅ Edit |

---

## 🎓 B.Tech CGPA System

- **10-point scale** (JNTUH / VTU / Anna University compatible)
- Grade O(10) → A+(9) → A(8) → B+(7) → B(6) → C(5) → F(0)
- **SGPA** = Σ(Grade Points × Credits) ÷ Σ(Credits per semester)
- **CGPA** = Σ(Grade Points × Credits ALL semesters) ÷ Σ(Total Credits)

---

## 🏢 Placements Module

30 companies including:
Google, Microsoft, Amazon, Meta, Apple, Netflix, Infosys, TCS, Wipro,
Cognizant, Accenture, Deloitte, Salesforce, Adobe, IBM, Oracle, Samsung,
Qualcomm, Texas Instruments, Bosch, L&T, Tata Motors, Mahindra,
Goldman Sachs, JP Morgan, Flipkart, Zomato, Razorpay, ISRO, DRDO

---

Built with ❤️ — EduNexus v2.0
