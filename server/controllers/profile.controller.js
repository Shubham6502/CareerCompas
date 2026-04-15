import mongoose from "mongoose";
import User from "../models/user.js";
import task_completion from "../models/task_completion.js";
import user_roadmap from "../models/user_roadmap.js";
import Roadmap from "../models/roadmap.js";
import jwt from "jsonwebtoken";
import { extractPublicId } from "../utils/extractPublicId.js";
import { v2 as cloudinary } from "cloudinary";
import Resource from "../models/resource.js";


export const getProfile = async (req, res) => {
  try {
    const token = req.cookies?.token;
   
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
   
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

  
    const userProfile = await User.findById(userId);
    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({ userProfile });

  } catch (error) {
    console.error("Error fetching profile:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    } 
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      {
       $set: req.body,
      },
      { new: true }
    );
    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    return res.status(200).json({ updatedProfile });
  }
    catch (error) {
    console.error("Error updating profile:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const updateProfilePicture = async (req, res) => {
  try {
    const token = req.cookies?.token;
 
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    } 

    if(!req.file){
      return res.status(400).json({ message: "No file uploaded" });
    }
    const profile = await User.findById(userId);

    if (profile.profilePicture) {
      const publicId = extractPublicId(profile.profilePicture);
      await cloudinary.uploader.destroy(publicId);
    }

    const imageUrl = req.file.path;

    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      { profilePicture: imageUrl },
      { new: true }
    );
    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    return res.status(200).json({ updatedProfile });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } 
    return res.status(500).json({ message: "Internal server error" });
  } 
};
export const getMaxStreak = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await task_completion.findOne({ userId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const maxStreak = user.longestStreak || 0;
    return res.status(200).json({ maxStreak });
  } catch (error) {
    console.error("Error fetching max streak:", error); 
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getSharedResourcesCountById = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    } 
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
  //  count the number of resources shared by the user
   const result = await Resource.aggregate([
  { $match: { userId: userId } }, 
  {
    $facet: {
      totalCount: [{ $count: "count" }],

      latest: [
        { $sort: { createdAt: -1 } },
        { $limit: 1 }
      ]
    }
  }
]);

const count = result[0].totalCount[0]?.count || 0;
const latestResource = result[0].latest[0] || null;

    return res.status(200).json({ resourcesCount: count, latestResource });
  } catch (error) {
    console.error("Error fetching shared resources count:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getRank = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
  const rankData = await task_completion.aggregate([
  {
    $group: {
      _id: "$userId",
      xp: { $max: "$xp" }
    }
  },
  {
    $setWindowFields: {
      sortBy: { xp: -1 },
      output: {
        rank: { $rank: {} }
      }
    }
  },
  {
    $match: {
      $expr: {
        $eq: [{ $toString: "$_id" }, userId]
      }
    }
  },
  {
    $project: {
      _id: 0,
      xp: 1,
      rank: 1
    }
  }
]);

return res.status(200).json(rankData[0] || {xp: 0, rank: null }); // return rank data or default if not found
  }
  catch (error) {
    console.error("Error fetching rank data:", error);
    if (error.name === "JsonWebTokenError") { 
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getUserModules= async (req, res) => {

  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    } 
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const data = await user_roadmap.aggregate([
  { $match: {  userId: new mongoose.Types.ObjectId(userId) } },

  { $unwind: "$roadmapIds" },

  {
    $lookup: {
      from: "roadmaps",
      localField: "roadmapIds.roadmapId",
      foreignField: "_id",
      as: "roadmap"
    }
  },

  { $unwind: "$roadmap" },

  {
    $project: {
      _id: 0,
      status: "$roadmapIds.status",
      roadmap: "$roadmap"
    }
  }
]);

res.json({ success: true, roadmapData: data });
  }
  catch (error) {
    console.error("Error fetching user modules:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } 
    return res.status(500).json({ message: "Internal server error" });
  }
};