
import express from "express";
import { addResources, deleteResource, getResources, getResourcesByUser, getUserResourcesCount, interactResources, topContributors, updateResource } from "../controllers/resourcesController.js";

const router = express.Router();

router.post("/add",addResources);
router.get("/getResources",getResources);
router.get("/getUserResources",getResourcesByUser);
router.get("/topContributors",topContributors);
router.post("/interact",interactResources);
router.get("/user/resourcescount/:clerkId",getUserResourcesCount);
router.put("/updateResource",updateResource);
router.delete("/deleteResource",deleteResource);
export default router;
