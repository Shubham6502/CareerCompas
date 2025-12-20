import User from "../models/User.js";

export const saveUser = async (req, res) => {
  try {
    const { clerkId, name, email } = req.body;

    if (!clerkId || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user already exists
    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({
        clerkId,
        name,
        email,
      });
    }

    res.json({ message: "User saved successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const UpdateUser = async (req, res) => {
    console.log("request Hit")
  try {
    const { clerkId, domain } = req.body;

    if (!clerkId || !domain) {
      return res.status(400).json({
        message: "clerkId and domain are required",
      });
    }

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.hasTakenTest) {
      return res.status(403).json({
        message: "Test already taken. Domain cannot be updated again.",
      });
    }
    user.hasTakenTest = true;
    user.domain = domain;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Test result saved successfully",
      domain: user.domain,
    });
  } catch (err) {
    return res.status(400).json({ message: "Something went wrong (Catch)" });
  }
};
