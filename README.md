# GeoCampusAttend 🎓📍  
A Role-Based Smart Attendance Management System with Geo-Fencing, Manual Attendance, Reports, and Admin Academic Control.

---

## 📌 Project Overview

**GeoCampusAttend** is a full-stack attendance management system designed for colleges/universities.  
It supports:

- Role-based authentication (Admin / Teacher / Student)
- Department, subject, and class management
- Teacher attendance sessions (Manual + Geo-Fencing)
- Student real-time attendance marking
- Attendance analytics & eligibility reports
- Excel report export (Monthly Summary)

This system solves common attendance problems like proxy attendance by adding **geolocation verification**.

---

## 🚀 Key Features

### 🔐 Authentication & Authorization
- JWT-based login system
- Token stored in browser localStorage
- Role-based protected routes (Admin / Teacher / Student)
- Auto logout / redirect on token expiry (using `authFetch`)

---

## 👤 Roles in System

### 🛡️ Admin (Academic Section)
Admin is responsible for academic setup and data management.

Admin can:
- Create departments
- Create classes
- Create subjects
- Register students
- Register teachers
- Assign teacher subjects + class mapping
- View and update student/teacher details

---

### 👨‍🏫 Teacher
Teacher can:
- Login using email/password
- View assigned classes and subjects
- Start attendance session (Manual / Geo-Fenced)
- End session
- View session history
- Edit attendance records
- Generate monthly reports

---

### 👨‍🎓 Student
Student can:
- Login using email/password
- View active geo attendance session
- Verify geolocation
- Mark attendance
- View attendance status and history

---

## 🏗️ Tech Stack

### Frontend
- React + TypeScript
- Tailwind CSS
- ShadCN UI Components
- Toast Notifications
- Custom `authFetch` wrapper for protected API calls

### Backend
- Node.js + Express.js
- PostgreSQL
- JWT Authentication
- bcrypt password hashing

### Reporting
- ExcelJS for `.xlsx` report export

---

## 📂 Project Structure

### Backend (Node.js / Express)
backend/
├── controllers/
├── routes/
├── middleware/
├── db/
├── server.js
└── .env


### Frontend (React)
frontend/
├── src/
│ ├── pages/
│ ├── components/
│ ├── utils/
│ ├── hooks/
│ └── App.tsx
└── vite.config.ts


---

## 🗄️ Database Tables Used

Main tables used:

- `users` (stores email, password_hash, role)
- `students`
- `teachers`
- `departments`
- `classes`
- `subjects`
- `subject_departments` (many-to-many mapping)
- `student_subjects` (subject registrations)
- `teacher_subjects` (teacher assignments with subject+class)
- `attendance_sessions`
- `attendance_records`

---
