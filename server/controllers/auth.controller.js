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
  subject: "OTP for Password Reset",
  html: `
    <div style="font-family: Arial, sans-serif;">
      <h2>Password Reset OTP</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP will expire in 5 minutes.</p>
    </div>
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
    
