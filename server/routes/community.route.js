import mongoose from "mongoose";
import express from "express";
import Community from "../models/Community.js";
import Message from "../models/Messege.js";
import Announcement from "../models/Announcement.js";
import Leaderboard from "../models/Leaderboard.js";

const router=express.Router();

// Create a new community
router.post("/create", async (req, res) => {

  const {communityId,name,code,ownerId,members}=req.body;
    try {
    const newCommunity = new Community({
        communityId:communityId,
        name:name,   
        code:code,
        owner: ownerId,
        // members: [{ user: ownerId, role: "owner" }],
        members:members
    });
    await newCommunity.save();
    console.log(newCommunity);
    res.status(201).json(newCommunity);
  } catch (error) {
    console.error("Error creating community:", error);
    res.status(500).json({ message: "Internal server error" });
  } 
});

router.get("/get/:currentUser",async(req,res)=>{
    
    try{
    const {currentUser}=req.params;
    
    
     const data = await Community.find({
      "members.user": currentUser
    });
    console.log(data);
    res.json(data);
    }
    catch(err){
        console.log(err);
         res.status(500).json({ message: "Server error" });
    }
})
export default router;