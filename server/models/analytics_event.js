import mongoose from 'mongoose';
const analyticsEventSchema=mongoose.Schema({
    _id:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    sessionId:{
        type:String,
        required:true   
    },
    event:{
        type:String,
        // enum:['page_view','click','task_completion','roadmap_interaction','achievement_unlocked'],


    },
    properties:{
        type:Object
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
export default mongoose.model('AnalyticsEvent',analyticsEventSchema)