import express from "express";
import {
  addClass,
  getClasses,
  updateClass,
  deleteClass,
  getClassesBySchoolFromDept,
} from "../controllers/classController.js";
import { authenticateUser, authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getClasses);
router.post("/", addClass);
router.put("/:id", updateClass);
router.delete("/:id", deleteClass);
router.get("/by-school/:dept", getClassesBySchoolFromDept);

export default router;