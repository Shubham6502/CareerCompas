
import express from "express";
import {upload,resumeUpload }from "../multer.js";
import { getProfile, updateProfile,updateProfilePicture ,getMaxStreak,getSharedResourcesCountById,
getRank,getUserModules
} from "../controllers/profile.controller.js";
const router = express.Router();

router.get("/", getProfile);
router.put("/", updateProfile);
router.post("/updateprofileimage", upload.single("profileImage"), updateProfilePicture);
router.get("/maxstreak", getMaxStreak);
router.get("/sharedresourcescount/", getSharedResourcesCountById);
router.get("/rank",getRank); 
router.get("/modules", getUserModules);
export default router;
