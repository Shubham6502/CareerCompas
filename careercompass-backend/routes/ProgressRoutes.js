import ProgressTrack from "../models/ProgressTrack.js";  
import express from "express";
const router=express.Router();

router.post("/initProgress",async(req,res)=>{
    const {clerkId,domain}=req.body;
    console.log(clerkId,domain);
    try{
        // Check if progress already exists
        const existingProgress = await ProgressTrack.findOne({ clerkId });
        if (existingProgress) {
            return res.status(400).json({ message: "Progress already initialized for this user." });
        }   
        const newProgress = new ProgressTrack({
            clerkId,
            domain,
            currentDay: 1,
            completedDays: [],
            progressPercent: 0, 
        });
        await newProgress.save();
        return  res.status(200).json({  
            success: true,
            message: "Progress initialized successfully",
        });
    }
    catch(err){
        return res.status(400).json({message:"Something went wrong (Catch)"});
    }
})
export default router;