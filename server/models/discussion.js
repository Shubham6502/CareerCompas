import mongoose from 'mongoose';
const discussionSchema=mongoose.Schema({
    _id:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    authorId:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    roadmapId:{ 
        type:mongoose.Types.ObjectId,
        ref:'Roadmap',
        required:true
    },
    taskId:{
        type:mongoose.Types.ObjectId,
        ref:'Task'  
    },
    parentId:{
        type:mongoose.Types.ObjectId,
        ref:'Discussion'
    },
    content:{
        type:String,
        required:true
    },
    upvotes:{
        type:Number,
        default:0
    },
    replyCount:{
        type:Number,
        default:0
    },
    isPinned:{
        type:Boolean,
        default:false
    },
    isDeleted:{
        type:Boolean,
        default:false   
    },

    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
})
export default mongoose.model('Discussion',discussionSchema)
    
    