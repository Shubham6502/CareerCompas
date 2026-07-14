import express from "express";
import { authenticateToken } from "../../middlewares/auth.middleware.js";
import * as userTaskProgressController from "./userTaskProgress.controller.js";


const router = express.Router();

router.get("/", authenticateToken, userTaskProgressController.getUserTaskProgress);
router.post("/", authenticateToken, userTaskProgressController.createUserTaskProgress);
router.put("/:id", authenticateToken, userTaskProgressController.updateUserTaskProgress);
router.delete("/:id", authenticateToken, userTaskProgressController.deleteUserTaskProgress);
export default router;