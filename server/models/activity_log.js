import mongoose from "mongoose";
const ActivityLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    activity:[{
        activityType: {
            type: String,
        },
        details: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
},
    {timestamps: true}
)
export default mongoose.model('ActivityLog', ActivityLogSchema)