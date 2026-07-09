import * as authRepository from "./auth.repository.js";
import { generateAuthToken, hashPassword,sendOtpResetPassword } from "./auth.utils.js";
import bcrypt from "bcrypt";
import BlacklistToken from "./tokenBlacklist.model.js";
import jwt from "jsonwebtoken";

const getRegisterNameFields = ({ firstName, lastName, displayName }) => {
  const cleanFirstName = firstName?.trim();
  const cleanLastName = lastName?.trim();

  if (cleanFirstName && cleanLastName) {
    return {
      firstName: cleanFirstName,
      lastName: cleanLastName,
      displayName: `${cleanFirstName} ${cleanLastName}`,
    };
  }

  const cleanDisplayName = displayName?.trim();
  if (!cleanDisplayName) {
    const error = new Error("First name and last name are required");
    error.statusCode = 400;
    throw error;
  }

  const [derivedFirstName, ...derivedLastNameParts] =
    cleanDisplayName.split(/\s+/);
  const derivedLastName = derivedLastNameParts.join(" ") || derivedFirstName;

  return {
    firstName: derivedFirstName,
    lastName: derivedLastName,
    displayName: cleanDisplayName,
  };
};

export const register = async (registerData) => {
  const { email, password } = registerData;
  const existingUser = await authRepository.findUserByEmail(email);

  if (existingUser) {
    const error = new Error("Email already in use");
    error.statusCode = 400;
    throw error;
  }

  const passwordHash = await hashPassword(password);
  const { firstName, lastName, displayName } =
    getRegisterNameFields(registerData);

  const newUser = await authRepository.createUser({
    email,
    passwordHash,
    authProvider: "local",
    firstName,
    lastName,
  });

  const token = generateAuthToken(newUser._id);

  return {
    token,
    user: {
      _id: newUser._id,
      email: newUser.email,
      displayName,
      token,
    },
  };
};

export const login = async (loginData) => {
  const { email, password,token } = loginData;
  const user= await authRepository.findUserPasswordHashByEmail(email);
   if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isValidPassword=await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }
  if(token) {
  const isInvalidToken = await authRepository.findTokenInBlacklist(token);
  if(isInvalidToken) {
    const error=new Error("Unauthorized: Invalid token");
    error.statusCode=401;
    throw error;
  }
  }
  const tokenGenerated = generateAuthToken(user._id);

  return {
    token: tokenGenerated,
    user: {
      _id: user._id,
      email: user.email,
      displayName: user.displayName,
      token: tokenGenerated,
    },
  };
};

export const logout = async (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const isInvalidToken = await authRepository.findTokenInBlacklist(token);
    if (isInvalidToken) {
      const error = new Error("Unauthorized: Invalid token");
      error.statusCode = 401;
      throw error;
    }
     // Convert to milliseconds
    await BlacklistToken.create({ tokenJti:token,userId:userId,expiresAt: new Date(),reason:"logout"  });
  } catch (error) {
    console.error("Error blacklisting token:", error);
    throw new Error("Unauthorized: Invalid token");
  }
};

export const getMe = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await authRepository.findUserById(decoded.userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    return {
      _id: user._id,
      email: user.email,
      displayName: user.displayName,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Internal server error");
  }
};
export const sendOtpForPasswordReset = async (email,otp) => {
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
   try{
  const otpHash = await hashPassword(otp.toString());
  //store the hashed OTP in the database
  const otpData = await authRepository.createOtpForResetPassword(email, otpHash);
  //send the OTP to the user's email
  const result = await sendOtpResetPassword(email, otp);
  return result;
   }
    catch (error) { 
      console.error("Error sending OTP:", error);
      throw new Error("Failed to send OTP");
    } 
}
export const verifyOtp = async (email, otp) => {
  const otpData = await authRepository.findOtpByEmail(email);
  if (!otpData) {
    const error = new Error("OTP not found for this email");
    error.statusCode = 404;
    throw error;
  }
  console.log("OTP Data from DB:", otpData);
  const isOtpValid = await bcrypt.compare(otp.toString(), otpData.otpHash);
  if (!isOtpValid) {
    const error = new Error("Invalid OTP");
    error.statusCode = 400;
    throw error;
  }
  
  if (otpData.expiresAt < new Date()) {
    const error = new Error("OTP has expired");
    error.statusCode = 400;
    throw error;
  }
  
  // If OTP is valid, you can delete it from the database or mark it as used
  await authRepository.deleteOtpByEmail(email);
  const resetToken = jwt.sign(
  {
    email,
    purpose: "password-reset",
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "5m",
  }
);
 
  return { message: "OTP verified successfully", resetToken };
};
export const resetPassword = async (email, newPassword,resetToken) => {
  const user = await authRepository.findUserPasswordHashByEmail(email);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
   const decoded = jwt.verify(
     resetToken,
     process.env.JWT_SECRET
   );

   if (decoded.purpose !== "password-reset") {
       throw new Error("Invalid token");
    }
    console.log("newPassword:", newPassword);
 const passwordHash = await hashPassword(newPassword);
  user.passwordHash = passwordHash;
  await user.save();
  
  return { message: "Password reset successfully" };
};