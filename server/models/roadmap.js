import mongoose from "mongoose";


const roadmapSchema = new mongoose.Schema({
  domain:{type:String,required:true},
  targetType:{type:String,required:true},
  experienceLevel:{type:String,required:true},
  timelineDays:{type:Number,required:true},
  studyHoursPerDay:{type:Number,default:2},
  goalRole:{type:String},
  day:[{
    dayNumber:{type:Number,required:true},
    taskIds:[{type:mongoose.Types.ObjectId,ref:'Task'}],

  }]


})
roadmapSchema.index({ domain: 1, targetType: 1, experienceLevel: 1 });
let Roadmap;

try {
  Roadmap = mongoose.model("Roadmap");
} catch (e) {
  Roadmap = mongoose.model("Roadmap", roadmapSchema);
}

export default Roadmap;
