// import express from "express";
// import { getDepartmentDetails, getDepartmentsWithSubjects } from "../controllers/deptController.js";

// const router = express.Router();

// router.get("/details", getDepartmentDetails);
// router.get("/with-subjects", getDepartmentsWithSubjects);

// export default router;

import express from "express";
import {
  getDepartmentDetails,
  getDepartmentsWithSubjects,
} from "../controllers/deptController.js";
import { authenticateUser } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/details", authenticateUser, getDepartmentDetails);
router.get("/with-subjects", authenticateUser, getDepartmentsWithSubjects);

export default router;