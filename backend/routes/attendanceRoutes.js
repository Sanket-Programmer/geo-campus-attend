import express from "express";
import {
  startSession,
  getActiveSession,
  markAttendance,
  getSessionStudents,
  endSession,
  editAttendance,
  getSessionHistory,
  getSessionDetails,
  markManualBulk,
  verifyAttendance,
  checkAttendanceStatus,
  getStudentAttendanceHistory,
  getStudentSubjectWiseAttendance,
  getStudentMonthlyAttendance,
  getTeacherEligibilityReport,
} from "../controllers/attendanceController.js";

import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/start", authorizeRoles("teacher"), startSession);

router.post("/mark-manual-bulk", authorizeRoles("teacher"), markManualBulk);

router.get("/session/:sessionId/students", authorizeRoles("teacher"), getSessionStudents);

router.put("/end/:sessionId", authorizeRoles("teacher"), endSession);

router.put("/edit", authorizeRoles("teacher"), editAttendance);

router.get("/history", authorizeRoles("teacher"), getSessionHistory);

router.get("/session/:id", authorizeRoles("teacher"), getSessionDetails);

router.get("/teacher/eligibility", authorizeRoles("teacher"), getTeacherEligibilityReport);

router.get("/active", authorizeRoles("student"), getActiveSession);

router.post("/mark", authorizeRoles("student"), markAttendance);

router.post("/verify", authorizeRoles("student"), verifyAttendance);

router.get("/status/:id", authorizeRoles("student"), checkAttendanceStatus);

router.get("/student/history", authorizeRoles("student"), getStudentAttendanceHistory);

router.get("/student/subject-wise", authorizeRoles("student"), getStudentSubjectWiseAttendance);

router.get("/student/monthly", authorizeRoles("student"), getStudentMonthlyAttendance);

export default router;
