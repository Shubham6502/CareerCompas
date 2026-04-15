import Resource from "../models/resource.js";
import User from "../models/user.js"; 
import jwt from "jsonwebtoken";

export const addResources = async (req, res) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        const userName= await User.findOne({ _id: userId }).select("displayName")||"";
        const  resource = req.body;
        const resourceData = {
            ...resource,
          userId,
          userName: userName.displayName,
        };

        await Resource.create(resourceData);
        return res.status(200).json({
            success: true,
            message: "Resource added successfully",
        });
    } catch (err) {
        return res.status(400).json({ success: false, message: "Something went wrong" });
    }
};
export const getResources = async (req, res) => {

  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
   

  try {

    const {page = 1, limit = 4, search = "", subject = "All" } = req.query;
    const skip = (page - 1) * limit;
    const query = {};
    if (subject !== "All") {
      query.subject = subject;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Resource.countDocuments(query);

    const data = await Resource.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
  
    res.json({
      data,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getResourcesByUser = async (req, res) => {
  try {
    const {
      clerkId,
      page = 1,
      limit = 4,
      search = "",
      subject = "All",
    } = req.query;
    if (!clerkId) {
      return res.status(400).json({ message: "clerkId is required" });
    }
    const skip = (page - 1) * limit;
    const query = { userId: clerkId };
    if (subject !== "All") {
      query.subject = subject;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Resource.countDocuments(query);

    const data = await Resource.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      data,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const topContributors = async (req, res) => {
  try {
    const topContributors = await Resource.aggregate([
      {
        $addFields: {
          upvoteCount: {
            $cond: [{ $isArray: "$upvote.ids" }, { $size: "$upvote.ids" }, 0],
          },
          downvoteCount: {
            $cond: [
              { $isArray: "$downvote.ids" },
              { $size: "$downvote.ids" },
              0,
            ],
          },
        },
      },
      {
        // STEP 2: group by user
        $group: {
          _id: "$userId",
          userName: { $first: "$userName" },
          totalResources: { $sum: 1 },
          totalUpvotes: { $sum: "$upvoteCount" },
          totalDownvotes: { $sum: "$downvoteCount" },
          totalViews: { $sum: { $ifNull: ["$views", 0] } },
        },
      },
      {
        // STEP 3: sort as per your rule
        $sort: {
          totalDownvotes: 1, // fewer downvotes first
          totalResources: -1,
          totalUpvotes: -1,
          totalViews: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);
   
    res.status(200).json(topContributors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch top contributors" });
  }
};

export const interactResources = async (req, res) => {
  try {

    const token=req.cookies?.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const {resourceId, action } = req.body;
   

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(400).json({ message: "Failed To Load" });
    }

    if (action === "UPVOTE") {
      if (resource.upvote.ids.includes(userId)) {
        resource.upvote = resource.upvote.ids.filter((id) => id !== userId);
      } else if (resource.downvote.ids.includes(userId)) {
        resource.downvote = resource.downvote.ids.filter(
          (id) => id !== userId,
        );
        resource.upvote.ids.push(userId);
      } else {
        resource.upvote.ids.push(userId);
      }
    }

    if (action === "DOWNVOTE") {
      if (resource.downvote.ids.includes(userId)) {
        resource.downvote = resource.downvote.ids.filter((id) => id !== userId);
      } else if (resource.upvote.ids.includes(userId)) {
        resource.upvote = resource.upvote.ids.filter((id) => id !== userId);
        resource.downvote.ids.push(userId);
      } else {
        resource.downvote.ids.push(userId);
      }
    }

    if (action === "VIEW") {
      resource.views += 1;
    }
    resource.save();
    
    return res.status(200).json({
      message: "Interaction recorded successfully",
      // upvote: resource.upvote.ids.count,
      // views: resource.views
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUserResources = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const { page = 1, limit = 4, search = "", subject = "All" } = req.query;
    const skip = (page - 1) * limit;
    const query = { userId };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (subject !== "All") {
      query.subject = subject;
    }

    const userResources = await Resource.find(query).skip(skip).limit(limit);
    const totalResources = await Resource.countDocuments(query);

    res.status(200).json({ userResources, totalResources });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateResource = async (req, res) => {
  try {
    const { _id, title, description, subject, domain, url } = req.body;

    const updatedResource = await Resource.findByIdAndUpdate(
      _id,
      { title, subject, url, description, domain },
      { new: true },
    );

    if (!updatedResource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res
      .status(200)
      .json({ message: "Resource updated successfully", updatedResource });
  } catch (error) {
    console.error("Error updating resource:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const { resourceId } = req.body;
    
    const deletedResource = await Resource.findByIdAndDelete(resourceId);

    if (!deletedResource) {
      return res.status(404).json({ message: "Resource not found" });
    }
   
    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ message: "Server error" });
  }
};
