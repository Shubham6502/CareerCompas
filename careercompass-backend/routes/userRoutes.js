import express from "express";
import { saveUser,UpdateUser,deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/save", saveUser);
router.post("/saveLogin",UpdateUser)
router.delete("/delete/:clerkId",deleteUser);
export default router;
