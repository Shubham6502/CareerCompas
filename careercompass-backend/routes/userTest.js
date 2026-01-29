import express from "express";
import User from "../models/User.js";

const router = express.Router();


router.get("/status/:clerkId", async (req, res) => {
  try {
    const { clerkId } = req.params;

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.json({ hasTakenTest: false });
    }

    res.json({ hasTakenTest: user.hasTakenTest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
