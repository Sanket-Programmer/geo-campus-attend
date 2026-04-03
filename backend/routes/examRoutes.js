import express from "express";
import { getEligibilityReport} from "../controllers/examController.js";
import { authenticateUser } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/eligibility",authenticateUser, getEligibilityReport);

export default router;