import Profile from "../models/Profile.js";
import express from "express";

const router = express.Router();

router.post("/save", async (req, res) => {
  const { user } = req.body;

  const UserProfile = await Profile.findOne({ userId: user.id });
  if (UserProfile) {
    return res.status(200).json({ message: "Already Exists" });
  }
  try {
    const newProfile = new Profile({
      userId: user.id,
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.primaryEmailAddress.emailAddress,
      profilepicture: user.imageUrl,
      joineddate: new Date().toISOString().split("T")[0],
    });
    await newProfile.save();
    return res.status(200).json({ message: "Profile Saved" });
  } catch {
    console.log("Profile saving Failed");
  }
});

router.get("/getprofile/:clerkId", async (req, res) => {
  try {
    const { clerkId } = req.params;
    const userProfile = await Profile.findOne({ userId: clerkId });

    if (!userProfile) {
      return res.status(400).json({ message: "Data Not Found" });
    }
    return res.status(200).json({ userProfile });
  } catch {
    console.log("Failed To fetch");
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/update/:clerkId", async (req, res) => {
  try {
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: req.params.clerkId },
      req.body,
      { new: true }
    );

    res.status(200).json({ updatedProfile });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});
router.put("/add-education/:clerkId", async (req, res) => {
  try {
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: req.params.clerkId },
      { $push: { education: req.body } },
      { new: true }
    );

    res.status(200).json({ updatedProfile });
  } catch (error) {
    res.status(500).json({ message: "Failed to add education" });
  }
});
router.put("/add-links/:clerkId", async (req, res) => {
  try {
    const updatedLinks = await Profile.findOneAndUpdate(
      { userId: req.params.clerkId },
      {
        $set: {
          "links.linkedin": req.body.linkedin,
          "links.github": req.body.github,
          "links.portfolio": req.body.portfolio,
        },
      },
      { new: true,
        upsert: true,
       }
    );

    if (!updatedLinks) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({updatedLinks});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/edit-education/:clerkId/:index",async(req,res)=>{
  try{
  const { clerkId,index} =req.params;
  
    const updatedEducation = await Profile.findOneAndUpdate(
      {userId:clerkId},
       {
        $set: {
          [`education.${index}`]: req.body,
        },
      },
      { new: true }
 )
  res.status(200).json({updatedEducation});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
  
})


export default router;
