import { TokenBlacklist } from "../models/token_blacklist.js";
import jwt from "jsonwebtoken";

export const authenticateToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    
    try{
        const blacklisted = await TokenBlacklist.findOne({ token });
        if (blacklisted) {
            return res.status(401).json({ message: "Token is blacklisted" });
        }
    } catch (error) {
        console.error("Error authenticating token:", error);
        return res.status(500).json({ message: "Internal server error" });


    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();

}
