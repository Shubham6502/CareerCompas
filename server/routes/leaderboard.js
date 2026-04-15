import express from "express";
import  {getLeaderBoardData}  from "../controllers/leaderboard.controller.js";

const router = express.Router();

router.get("/getLeaderBoardData",getLeaderBoardData);

export default router;
