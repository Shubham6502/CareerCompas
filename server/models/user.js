import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
      index: true,
    },
    passwordHash: {
      type: String,
      required: function () { return this.authProvider === "local"; },
      select: false, // never returned by default queries
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
    providerId: { type: String, default: null }, // OAuth subject id

    firstName: { type: String, required: true, trim: true, maxlength: 60 },
    lastName: { type: String, required: true, trim: true, maxlength: 60 },
    avatarUrl: { type: String, default: null },

    role: {
      type: String,
      enum: ["student", "mentor", "moderator", "admin"],
      default: "student",
      index: true,
    },

    accountStatus: {
      type: String,
      enum: ["pending-verification", "active", "suspended", "deactivated"],
      default: "pending-verification",
      index: true,
    },
    emailVerified: { type: Boolean, default: false },

    subscriptionTier: {
      type: String,
      enum: ["free", "pro", "premium"],
      default: "free",
    },

    mfaEnabled: { type: Boolean, default: false },
    mfaSecret: { type: String, default: null, select: false },

    security: {
      lastLoginAt: { type: Date, default: null },
      lastLoginIpHash: { type: String, default: null }, // hashed, never raw IP
      failedLoginAttempts: { type: Number, default: 0 },
      lockedUntil: { type: Date, default: null },
      passwordChangedAt: { type: Date, default: null },
      refreshTokenVersion: { type: Number, default: 0 }, // bump to invalidate all refresh tokens
    },

    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },

    schemaVersion: { type: Number, default: 1 },
  },
  { timestamps: true } // createdAt, updatedAt
);
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ authProvider: 1, providerId: 1 }, { unique: true, sparse: true, partialFilterExpression: { providerId: { $ne: null } } });
UserSchema.index({ role: 1, accountStatus: 1 }); // compound — admin panel filtering
UserSchema.index({ isDeleted: 1 });
UserSchema.index({ createdAt: -1 }); // signup growth queries, admin recent-signups view
export default mongoose.model("User", UserSchema);
