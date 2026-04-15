import mongoose from "mongoose";
const createJobApplicationSchema = new mongoose.Schema({
    clerkId:{
        type:String,
        required:true
    },
    applications:[{
        _id:{
            type:mongoose.Schema.Types.ObjectId,
            default:()=> new mongoose.Types.ObjectId()
        },
        company:{
            type:String,
            required:true
        },
        role:{
            type:String,
        },
        location:{
            type:String,
        },
        date:{
            type:Date,
        },
        status:{
            type:String,
            default:"Applied"
        },
        link:{
            type:String,
        }



    }]
});
export const JobApplication = mongoose.model("JobApplication",createJobApplicationSchema);