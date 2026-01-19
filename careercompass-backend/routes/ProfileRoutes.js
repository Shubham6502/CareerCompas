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


export default router;
