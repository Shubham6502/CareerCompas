import mongoos from 'mongoose';
const notificationSchema=mongoos.Schema({
    _id:{
        type:mongoos.Types.ObjectId,
        required:true
    },
    userId:{
        type:mongoos.Types.ObjectId,
        ref:'User', 
        required:true
    },
    type:{  
        type:String,
        // enum:['new_comment','roadmap_update','task_reminder','achievement_unlocked'],
        required:true
    },
    message:{
        type:String,
        required:true
    },
    referenceId:{
        type:mongoos.Types.ObjectId
    },
    refferenceModel:{
        type:String,
        // enum:['Discussion','Roadmap','Task','Achievement']
    },
    isRead:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
export default mongoos.model('Notification',notificationSchema)