import mongoose from "mongoose";

const skillDistributionSchema = new mongoose.Schema({

    domain: {
        type: String,
        required: true,
        index: true
    },
    roadmapId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "NewRoadmap",
        required: true,
    },
    skillDistribution:[{
            skill: String,
            percentage: Number
    }],
}, { timestamps: true });

const SkillDistribution = mongoose.model("SkillDistribution", skillDistributionSchema);
export default SkillDistribution;

