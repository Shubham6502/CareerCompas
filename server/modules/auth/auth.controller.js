import User from "../../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";
import nodemailer from "nodemailer";
import * as authService from "./auth.service.js";

export const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: result.user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  await body("email").isEmail().run(req);
  await body("password").isLength({ min: 6 }).run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const token = req.cookies?.token;
    const result = await authService.login({ email, password,token });
     res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      message: "User logged in successfully",
      user: result.user,
    });  
  } catch (error) {
    console.error("Error logging in:", error);
    const status = error.statusCode === 401 ? 400 : (error.statusCode || 500);
    return res.status(status).json({ message: error.message || "Internal server error" });
  }
};
// LogOut------
export const logout = async (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }
  try{
  const result = await authService.logout(token);
 
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });
  } catch (error) {
    console.error("Error logging out:", error);
    return res.status(500).json({ message: "Unauthorized: Invalid token" });
  }
  res.json({ message: "Logout successful" });
};

export const getme = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await authService.getMe(token);

    res.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    //const purpose=req.body.purpose; // e.g., "password-reset"
    const otp = Math.floor(
      100000 + Math.random() * 900000
    );
  //  if(purpose==="password-reset"){
    const result = await authService.sendOtpForPasswordReset(email, otp);    
  // }else{
    //otp for other purposes can be handled here
  // }
    return res.status(200).json({
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to send OTP",
    });
  }
};
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const result = await authService.verifyOtp(email, otp);
        if (!result) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        return res.status(200).json({ message: "OTP verified successfully", resetToken: result.resetToken });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const resetPassword = async (req, res) => {
    try {
        const { email,newPassword,resetToken } = req.body;
        const result = await authService.resetPassword(email,newPassword,resetToken);
        if (!result) {
            return res.status(400).json({ message: "Failed to reset password" });
        }
        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

};
    
