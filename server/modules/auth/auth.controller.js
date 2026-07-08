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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const { default: TokenBlacklist } = await import(
      "../../models/tokenBlacklist.js"
    );
    const blacklistedToken = await TokenBlacklist.findOne({
      token: req.cookies?.token,
    });
    if (blacklistedToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    // Log the login activity
    const { default: activity_log } = await import(
      "../../models/activity_log.js"
    );
    await activity_log.findOneAndUpdate(
      { userId: user._id },
      {
        $push: {
          activity: {
            activityType: "UserLogin",
            details: "User logged in successfully",
            createdAt: new Date(),
          },
        },
      },
      {
        upsert: true, // create if not exists
        new: true,
      },
    );
    res.json({
      message: "Login successful",
      user: {
        email: user.email,
        displayName: user.displayName,
        token,
        _id: user._id,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }
  try {
    const { default: TokenBlacklist } = await import(
      "../../models/tokenBlacklist.js"
    );
    const data = await TokenBlacklist.create({ token, expiresAt: new Date() });
  } catch (error) {
    console.error("Error blacklisting token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }

  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });

  res.json({ message: "Logout successful" });
};

export const getme = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-passwordHash");

    res.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;


    const user = await User.findOne({ email });
    

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    );

    // Save OTP in database
   user.resetOtp = otp;
   user.resetOtpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

  await transporter.sendMail({
  from: process.env.EMAIL_FROM,
  to: email,
  subject: "Career Compass • Password Reset OTP",
  html: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
  </head>
  <body style="margin:0;padding:0;background:#f4f7fb;font-family:Inter,Arial,sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 20px;">

          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td align="center"
                style="background:linear-gradient(135deg,#6d5dfc,#8b5cf6);padding:32px;">
                
                <h1 style="margin:0;color:white;font-size:28px;font-weight:700;">
                  Career Compass
                </h1>

                <p style="margin-top:8px;color:rgba(255,255,255,0.9);font-size:14px;">
                  Navigate Your Career Journey
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:40px;">

                <h2 style="margin:0 0 16px;color:#111827;">
                  Password Reset Request
                </h2>

                <p style="color:#6b7280;font-size:15px;line-height:1.7;">
                  We received a request to reset your password.
                  Use the verification code below to continue.
                </p>

                <!-- OTP Card -->
                <div style="
                  margin:30px 0;
                  background:#f8faff;
                  border:2px dashed #6d5dfc;
                  border-radius:14px;
                  text-align:center;
                  padding:24px;
                ">
                  <p style="
                    margin:0;
                    color:#6b7280;
                    font-size:13px;
                    letter-spacing:1px;
                    text-transform:uppercase;
                  ">
                    One-Time Password
                  </p>

                  <h1 style="
                    margin:12px 0 0;
                    color:#6d5dfc;
                    font-size:42px;
                    letter-spacing:10px;
                    font-weight:700;
                  ">
                    ${otp}
                  </h1>
                </div>

                <p style="color:#6b7280;font-size:14px;">
                  This OTP will expire in
                  <strong>5 minutes</strong>.
                </p>

                <p style="color:#6b7280;font-size:14px;">
                  If you didn't request a password reset,
                  you can safely ignore this email.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center"
                style="
                  background:#f9fafb;
                  padding:24px;
                  border-top:1px solid #e5e7eb;
                ">

                <p style="
                  margin:0;
                  color:#9ca3af;
                  font-size:12px;
                ">
                  © ${new Date().getFullYear()} Career Compass
                </p>

                <p style="
                  margin-top:8px;
                  color:#9ca3af;
                  font-size:12px;
                ">
                  Helping students and professionals achieve career success.
                </p>

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `,
});
    
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
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.resetOtp !== otp || user.resetOtpExpiry < new Date()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const resetPassword = async (req, res) => {
    try {
        const { email,newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }   
        const passwordHash = await bcrypt.hash(newPassword, 10);
        user.passwordHash = passwordHash;
        user.resetOtp = null;
        user.resetOtpExpiry = null;
        await user.save();
        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

};
    
