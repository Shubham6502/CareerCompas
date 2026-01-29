import Roadmap from "../models/Roadmap.js";

export const getRoadmapByDomain= async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({
      domain: req.params.domain,
    });

    if (!roadmap) {
      return res.status(400).json({ message: "data not found" });
    }
    res.json(roadmap);
  } catch(error) {
    return res.status(500).json({ error: error.message });
  }
}
export const getRoadmapsByDay= async (req, res) => {
  const { domain } = req.params;
  const { day } = req.query;

  try {
    const roadmap = await Roadmap.findOne(
      { domain },
      {
        days: { $elemMatch: { day: parseInt(day) } },
      },
    );
    if (!roadmap) {
      return res.status(400).json({ message: "data not found" });
    }
    res.json(roadmap);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}