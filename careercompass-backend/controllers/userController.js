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
