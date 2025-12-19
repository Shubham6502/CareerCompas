import data from "./RoadmapData.js"
import Roadmap from "../models/Roadmap.js"
import mongoose from "mongoose"
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("SuccessFully Inserted"))
.catch((err)=>console.log(err))

const mapseed=async()=>{
    await Roadmap.deleteMany({});
    await Roadmap.create(data);
    console.log("Data Inserted");
}

mapseed();
