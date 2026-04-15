import express from "express";
import { getApplications,addApplication ,deleteApplication,editApplication} from "../controllers/application.controller.js";
const router = express.Router();

router.get("/get", getApplications);
router.post("/add", addApplication);
router.delete("/delete/:appId", deleteApplication);
router.put("/edit/:appId", editApplication);

export default router;