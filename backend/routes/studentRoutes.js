import express from "express";
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getRegisteredSubjects,
} from "../controllers/studentController.js";
import { authenticateUser, authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/",authenticateUser, createStudent);

router.get("/",authenticateUser, getStudents);

router.get("/subjects", authorizeRoles("student"), getRegisteredSubjects);

router.get("/:id",authenticateUser, getStudentById);

router.put("/:id",authenticateUser, updateStudent);

router.delete("/:id",authenticateUser, deleteStudent);

export default router;

