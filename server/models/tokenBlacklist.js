import mongoose from "mongoose";
const { Schema } = mongoose;
const TokenBlacklistSchema = new Schema({
  tokenJti: { type: String, required: true, unique: true }, // the JWT's `jti` claim — never store the full token string
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reason: { type: String, enum: ["logout","security-revocation","password-change"], required: true },
  expiresAt: { type: Date, required: true }, // set equal to the token's own original expiry
  createdAt: { type: Date, default: Date.now },
});
TokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL — auto-deletes exactly when the token would've expired anyway
export default mongoose.model("TokenBlacklist", TokenBlacklistSchema);