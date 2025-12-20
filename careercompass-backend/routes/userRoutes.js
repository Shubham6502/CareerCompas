import express from "express";
import { saveUser,UpdateUser } from "../controllers/userController.js";


const router = express.Router();
console.log("route")
router.post("/save", saveUser);

router.post("/saveLogin",UpdateUser)
export default router;
