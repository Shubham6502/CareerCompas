import mongoose from 'mongoose';
// import roadmap from './newroadmap';
const taskCompletionSchema=mongoose.Schema({
  
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    roadmapId:{
        type:mongoose.Types.ObjectId,
        ref:'UserRoadmap',  
        
    },
    
    days:[{
        dayNumber:{type:Number,required:true},
        date:{type:Date,default:Date.now},// Store the date when the day started
        completedTaskIds:[{type:mongoose.Types.ObjectId,ref:'Task'}],
    }],

    xp:{type:Number,default:0},

    status:{
        type:String,
        // enum:['not_started','in_progress','completed','skipped'],
        default:'in_progress'
    },
    

  
    currentStreak:{type:Number,default:0},
    longestStreak:{type:Number,default:0},
    // currentDay:{type:Number}, // Calculate current day based on last activity and start date
    lastActivityAt:{type:Date},
    startedAt:{type:Date},
    lastCompletedDate:{
        type:Date,
        default: function () {
        return this.startedAt;
        }
   },
 
})
taskCompletionSchema.index({ userId: 1, roadmapId: 1 });
taskCompletionSchema.index({ "days.dayNumber": 1 });
export default mongoose.model('TaskCompletion',taskCompletionSchema)