import express from "express";
import * as authController from "./auth.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";
import { validateRegister } from "./auth.validation.js";

const router = express.Router();

router.post("/register", validateRegister, authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.get("/me", authenticateToken, authController.getme);

router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.post("/reset-password", authController.resetPassword);

export default router;
