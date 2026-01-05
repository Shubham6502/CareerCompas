import Resource from "../models/Resource.js";
import express from "express";


const router =express.Router();

router.post('/add',async(req,res)=>{
const {clerkId,data,userName}=req.body;



try{
    const newResource=new Resource({
        userId:clerkId,
        userName:userName,
        title:data.title,
        subject:data.subject,
        url:data.link,
        date:new Date(),
        domain:data.domain,
        description:data.description,
        upvote:0,
        downvote:0,
        views:0,
    });
    await newResource.save();
    return res.status(200).json({
        success:true,
        messege:"Resources Saved Successefully"
    });

}catch(err){
    return res.status(400).json({success:false,messege:"Something Went Wrong"});
}
});

router.get("/getResources", async (req, res) => {
  try {
     const {
      page = 1,
      limit = 4,
      search = "",
      subject = "All",
    } = req.query;


    const skip = (page - 1) * limit;

    const query = {};

    if (subject !== "All") {
      query.subject = subject;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Resource.countDocuments(query);

    const data = await Resource.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      data,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
export default router;