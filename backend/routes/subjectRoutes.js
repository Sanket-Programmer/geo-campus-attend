import express from "express";
import {
  getSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
  getSubjectsByDepartment,
  getSubjectsBySchoolFromDept,
} from "../controllers/subjectController.js";
import { authenticateUser, authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/",authenticateUser, getSubjects);
router.post("/", addSubject);
router.put("/:id", updateSubject);
router.delete("/:id", deleteSubject);
router.get("/by-department/:dept", getSubjectsByDepartment);
router.get("/by-school/:dept", getSubjectsBySchoolFromDept);

export default router;