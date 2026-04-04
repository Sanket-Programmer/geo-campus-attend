import express from "express";
import pool from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import deptRoutes from "./routes/deptRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/departments", deptRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/exam", examRoutes);
app.use("/api/reports", reportsRoutes);

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.log("Database connection error", err);
  } else {
    console.log("Database connected:", res.rows[0]);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
