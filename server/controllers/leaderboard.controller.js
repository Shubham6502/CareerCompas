import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import  task_completion  from "../models/task_completion.js";
import user from "../models/user.js";
dotenv.config();

 export const getLeaderBoardData = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Fetch user data and leaderboard data
  const leaderboardData = await task_completion.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },  
      { $unwind: "$user" },
      {
    $setWindowFields: {
      sortBy: { xp: -1 },
      output: {
        rank: { $rank: {} }
      }
    }
  },
      {
        $project: { 
          _id: 0,
          userId: 1,
          xp: 1,
          rank: 1,
          name: "$user.displayName",
          profileImage: "$user.profilePicture",
        },
      },
      { $sort: { xp: -1 } },
    ]);


    return res.json({ success: true, leaderboard: leaderboardData });


    } catch (error) {
        console.error("Error fetching leaderboard data:", error);   
        res.status(500).json({ success: false, message: "Server error" });
    }
}