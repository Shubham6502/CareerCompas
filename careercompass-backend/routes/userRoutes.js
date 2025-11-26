import express from "express";
import { saveUser } from "../controllers/userController.js";

const router = express.Router();
console.log("route")
router.post("/save", saveUser);

export default router;
