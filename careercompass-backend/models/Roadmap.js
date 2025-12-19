import mongoose from "mongoose";
const daySchema=new mongoose.Schema({
    day:String,
    task:[String],
    done:{
        type:Boolean,
        default:false,
    },
    })
const weekSchema=new mongoose.Schema({
    week:String,
    days:[daySchema],
})
const monthSchema=new mongoose.Schema({
    month:String,
    focus:String,
    desc:String,
    weeks:[weekSchema],
})
const roadmapSchema=new mongoose.Schema({
    domain:{
        type:String,
        required:true,
    },
    duration:{
        type:String,
        default:"3 Months",
    },
    months:[monthSchema],
})
export default mongoose.model("Roadmap",roadmapSchema);