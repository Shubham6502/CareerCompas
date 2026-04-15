import Profile from "../models/Profile.js";
import { extractPublicId } from "../utils/extractPublicId.js";
import { v2 as cloudinary } from "cloudinary";


export const saveProfile=async (req, res) => {
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
}

export const getProfile=async (req, res) => {
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
}
export const updateProfile=async (req, res) => {
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
}
export const addEducation= async (req, res) => {
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
}
export const addLinks=async (req, res) => {
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
}

export const editEducation=async(req,res)=>{
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
  
}

export const deleteProfile=async (req, res) => {
  try {
    const { clerkId } = req.params;

    
    const profile = await Profile.findOne({ userId: clerkId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Delete image from Cloudinary if exists

   if (profile?.profilepicture) {
      const publicId = extractPublicId(profile.profilepicture);
      await cloudinary.uploader.destroy(publicId);
    }
    // Delete profile from DB
    await Profile.findOneAndDelete({ userId: clerkId });

    return res.status(200).json({
      message: "Profile deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Deletion failed",
    });
  }
};

export const profilePictureUpdate = async (req, res) => {
  try {
    const { clerkId } = req.params;

    // Validate profile
    const profile = await Profile.findOne({ userId: clerkId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Validate file
    if (!req.file) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    // Delete old image from Cloudinary
    if (profile.profilepicture) {
      const publicId = extractPublicId(profile.profilepicture);
      await cloudinary.uploader.destroy(publicId);
    }

    // New image URL (Cloudinary)
    const imageUrl = req.file.path;

    // Update DB
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: clerkId },
      { profilepicture: imageUrl },
      { new: true }
    );

    return res.status(200).json({
      message: "Profile picture updated successfully",
      profile: updatedProfile,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Profile picture update failed",
    });
  }
};
