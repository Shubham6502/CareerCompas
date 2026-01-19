import Resource from "../models/Resource.js";
import express from "express";

const router = express.Router();

router.post("/add", async (req, res) => {
  const { clerkId, data, userName } = req.body;

  try {
    const newResource = new Resource({
      userId: clerkId,
      userName: userName,
      title: data.title,
      subject: data.subject,
      url: data.link,
      date: new Date(),
      domain: data.domain,
      description: data.description,
      upvote: 0,
      downvote: 0,
      views: 0,
    });
    await newResource.save();
    return res.status(200).json({
      success: true,
      messege: "Resources Saved Successefully",
    });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, messege: "Something Went Wrong" });
  }
});

router.get("/getResources", async (req, res) => {
  try {
    const { page = 1, limit = 4, search = "", subject = "All" } = req.query;

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
});

router.get("/topContributors", async (req, res) => {
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
});
router.post("/interact", async (req, res) => {
  try {
    const { clerkId, ResourceId, action } = req.body;

    const resource = await Resource.findById(ResourceId);
    if (!resource) {
      return res.status(400).json({ message: "Failed To Load" });
    }

    if (action === "UPVOTE") {
      if (resource.upvote.ids.includes(clerkId)) {
        resource.upvote = resource.upvote.ids.filter((id) => id !== clerkId);
      } else if (resource.downvote.ids.includes(clerkId)) {
        resource.downvote = resource.downvote.ids.filter(
          (id) => id !== clerkId
        );
        resource.upvote.ids.push(clerkId);
      } else {
        resource.upvote.ids.push(clerkId);
      }
    }

    if (action === "DOWNVOTE") {
      if (resource.downvote.ids.includes(clerkId)) {
        resource.downvote = resource.upvote.ids.filter((id) => id !== clerkId);
      } else if (resource.upvote.ids.includes(clerkId)) {
        resource.upvote = resource.upvote.ids.filter((id) => id !== clerkId);
        resource.downvote.ids.push(clerkId);
      } else {
        resource.downvote.ids.push(clerkId);
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
});
export default router;
