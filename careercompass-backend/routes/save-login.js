import User from "../models/User";
import express from "express";


const router=express.Router();
router.post("/user/save-login",async(req,res)=>{
    const {clerkId,domain}=req.body;
    
    
    if(!clerkId || !domain){
        return res.status(400).json({message:"Something went wrong"});
    }
    try{
     const user= await User.findOne({clerkId});
    user.hasTakenTest=true;
    user.domain=domain;
    await user.save();
     return res.status(200).json({
      success: true,
      message: "Test result saved successfully",
      domain: user.domain,
    });

        
    }catch(err){
        return res.status(400).json({message:"Something went wrong (Catch)"});
    }

})