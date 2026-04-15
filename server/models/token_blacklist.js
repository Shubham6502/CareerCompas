import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema({
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true, default: Date.now, index: { expires: '7d' } } // Automatically remove after 7 days,
});

export const TokenBlacklist = mongoose.model("TokenBlacklist", tokenBlacklistSchema);      