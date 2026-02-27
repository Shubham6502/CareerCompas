import express from "express";
import { getApplications,addApplication ,deleteApplication,editApplication} from "../controllers/applicationController.js";
const router = express.Router();

router.get("/:clerkId", getApplications);
router.post("/:clerkId", addApplication);
router.delete("/:clerkId/:appId", deleteApplication);
router.put("/:appId", editApplication);

export default router;