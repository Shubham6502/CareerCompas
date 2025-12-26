import express from "express";
import Roadmap from "../models/Roadmap.js";

const router=express.Router();

router.get("/:domain",async(req,res)=>{
    try {
        const roadmap=await Roadmap.findOne({
            domain:req.params.domain
            
    });
   
    if(!roadmap){
        return res.status(400).json({message:"data not found"});
    }
    res.json(roadmap);
    
    }catch{
        return res.status(500).json({error:error.message})
    }

})

router.get("/getRoadmap/:domain",async(req,res)=>{
    const {domain}=req.params;
    const {day}=req.query;
    
    try{
        const roadmap=await Roadmap.findOne(
            {domain},
        {
            days:{$elemMatch:{day:parseInt(day)}}
        }    
        )
        if(!roadmap){
            return res.status(400).json({message:"data not found"});
        }   
        res.json(roadmap);
    }catch(err){
        return res.status(500).json({error:error.message})
    }
});
export default router;