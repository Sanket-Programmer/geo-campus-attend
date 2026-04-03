import express from "express";

import {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  getTeacherAssignments
} from "../controllers/teacherController.js";

import { authenticateUser } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/",authenticateUser, createTeacher);

router.get("/",authenticateUser, getTeachers);

router.get("/assignments",authenticateUser, getTeacherAssignments);

router.get("/:id",authenticateUser, getTeacherById);

router.put("/:id",authenticateUser, updateTeacher);

router.delete("/:id",authenticateUser, deleteTeacher);

export default router;