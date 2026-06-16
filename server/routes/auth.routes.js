import express from "express";
import { register,login,logout,getme,sendOtp,verifyOtp,resetPassword} from "../controllers/auth.controller.js";
import {authenticateToken} from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login",login);
router.post("/logout", logout);
router.get("/me", authenticateToken, getme);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);



export default router;