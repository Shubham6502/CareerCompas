import express from "express";
import upload from "../multer.js";
import { saveProfile,getProfile, updateProfile, addEducation, addLinks, editEducation, deleteProfile, profilePictureUpdate } from "../controllers/profileController.js";


const router = express.Router();

router.post("/save", saveProfile);
router.get("/getprofile/:clerkId",getProfile);
router.put("/update/:clerkId", updateProfile);
router.put("/add-education/:clerkId",addEducation);
router.put("/add-links/:clerkId", addLinks);
router.put("/edit-education/:clerkId/:index",editEducation)
router.put("/update-profile-picture/:clerkId",upload.single("profilepicture"),profilePictureUpdate);
router.delete("/delete/:clerkId", deleteProfile);


export default router;
