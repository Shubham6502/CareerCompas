
import Assessment from "../models/Assessment.js";
import express from "express";
const router=express.Router();

router.get("/get", async (req, res) => {
  const { day } = req.query;

  const assessment = await Assessment.findOne({ day });
    if (!assessment) {
    return res.status(404).json({ message: "Assessment not found" });
  }

  res.json(assessment);
});

export default router;



