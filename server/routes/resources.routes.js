
import express from "express";
import { addResources,getResources,interactResources,getUserResources,updateResource,deleteResource } from "../controllers/resources.controller.js";

const router = express.Router();

router.post("/add",addResources);
router.get("/all",getResources);
router.post("/interact",interactResources);
//user resources
router.get("/userresources",getUserResources);
router.put("/updateresource",updateResource);
router.delete("/deleteresource",deleteResource);

export default router;
