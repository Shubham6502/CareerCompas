import User from "../../models/user.js";
import BlacklistToken from "./tokenBlacklist.model.js";
import OtpModel from "./otp.model.js";

export const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

export const createUser = async (userData) => {
  return User.create(userData);
};

export const findUserPasswordHashByEmail = async (email) => {
  const user = await User.findOne({ email }).select("passwordHash _id displayName email");
  return user ? user : null;
};

export const findTokenInBlacklist = async (tokenJti) => {
  return await BlacklistToken.findOne({ tokenJti });
};

export const createOtpForResetPassword = async (email, otpHash) => {
   await OtpModel.findOneAndUpdate(
  { email, purpose: "password-reset" },
  {
    otpHash,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    attempts: 0, // Reset because it's a NEW OTP
  },
  {
    upsert: true,
    new: true,
  }
);
}
export const findOtpByEmail = async (email) => {
  // Find the OTP document for the given email and purpose(later you can add purpose as a parameter if needed)
  return await OtpModel.findOne({ email });

};
export const deleteOtpByEmail = async (email) => {
  // Delete the OTP document for the given email and purpose(later you can add purpose as a parameter if needed)
  return await OtpModel.deleteOne({ email });
};