import mongoose from "mongoose";
import SkillDistribution from "../models/Refactor/skill_distribution.js";

const skillDistributions = [
    {
        domain:"SWE",
        roadmapId: new mongoose.Types.ObjectId("69beceee03b6ea74d337e097"),
        skillDistribution:[
            { skill: "DSA", percentage: 64.3 },
            { skill: "CS Fundamentals", percentage: 12.9 },
            { skill: "Interview Prep", percentage: 8.6 },
            { skill: "Review", percentage: 5.7 },
            { skill: "System Design", percentage: 5.0 },
            { skill: "Development", percentage: 2.9 },
            { skill: "Wellness", percentage: 0.7 },
        ]
    }
]



async function seedSkillDistributions() {
 const dbUri = "mongodb+srv://shubhampatil6502_db_user:4HutoG9WmrVcmkhA@cluster0.gnqk5f9.mongodb.net/careercompass?retryWrites=true&w=majority&appName=Cluster0";
   
        await mongoose.connect(dbUri);
        console.log("Connected to MongoDB for skill distribution seeding");
            
    try {
       
        await SkillDistribution.insertMany(skillDistributions);
        console.log("Skill distributions seeded successfully");
    } catch (error) {
        console.error("Error seeding skill distributions:", error);
    } finally {
        mongoose.connection.close();
    }
}

seedSkillDistributions();