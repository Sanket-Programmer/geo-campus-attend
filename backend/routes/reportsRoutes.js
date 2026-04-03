import express from "express";
import { authenticateUser } from "../middleware/roleMiddleware.js";
import {
  getMonthlySummaryReport,
  exportMonthlyExcelReport,
} from "../controllers/reportsController.js";

const router = express.Router();

router.get("/monthly-summary", authenticateUser, getMonthlySummaryReport);

router.get("/export", authenticateUser, exportMonthlyExcelReport);

export default router;