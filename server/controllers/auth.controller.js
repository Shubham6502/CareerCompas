import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { TokenBlacklist } from "../models/token_blacklist.js";
import { body, validationResult } from "express-validator";
import activity_log from "../models/activity_log.js";
import nodemailer from "nodemailer";

export const register = async (req, res) => {
  await body("email").isEmail().run(req);
  await body("password").isLength({ min: 6 }).run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password, displayName } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      email,
      passwordHash,
      displayName,
    });
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    await newUser.save();
    // Log the registration activity
    await activity_log.create({
      userId: newUser._id,
      activity: {
        activityType: "UserRegistration",
        details: "User registered successfully",
        createdAt: new Date(),
      },
    });
    res
      .status(201)
      .json({
        message: "User registered successfully",
        user: {
          _id: newUser._id,
          email: newUser.email,
          displayName: newUser.displayName,
          token,
        },
      });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
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
<title>Career Compass OTP</title>
</head>
<body style="margin:0;padding:0;background:#f5f7fb;font-family:Inter,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:40px 20px;">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">

<!-- Header -->
<tr>
<td style="padding:32px 40px;border-bottom:1px solid #f1f5f9;">

<h1 style="
margin:0;
font-size:24px;
font-weight:700;
color:#111827;
">
Career Compass
</h1>

<p style="
margin:8px 0 0;
font-size:14px;
color:#64748b;
">
Navigate your career with confidence.
</p>

</td>
</tr>

<!-- Content -->
<tr>
<td style="padding:40px;">

<h2 style="
margin:0 0 16px;
font-size:22px;
color:#111827;
font-weight:600;
">
Password Reset Verification
</h2>

<p style="
margin:0 0 24px;
font-size:15px;
line-height:1.7;
color:#475569;
">
We received a request to reset your password.
Use the verification code below to continue.
</p>

<!-- OTP Box -->
<div style="
background:#f8fafc;
border:1px solid #e2e8f0;
border-radius:12px;
padding:24px;
text-align:center;
">

<p style="
margin:0 0 10px;
font-size:13px;
letter-spacing:1px;
color:#64748b;
text-transform:uppercase;
">
Verification Code
</p>

<div style="
font-size:40px;
font-weight:700;
letter-spacing:10px;
color:#0f172a;
">
${otp}
</div>

</div>

<p style="
margin-top:24px;
font-size:14px;
color:#475569;
">
This code will expire in <strong>5 minutes</strong>.
</p>

<p style="
margin-top:20px;
font-size:14px;
color:#64748b;
">
If you did not request a password reset, you can safely ignore this email.
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="
padding:24px 40px;
border-top:1px solid #f1f5f9;
">

<p style="
margin:0;
font-size:13px;
color:#94a3b8;
">
© ${new Date().getFullYear()} Career Compass. All rights reserved.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`
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
    
