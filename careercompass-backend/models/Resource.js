import mongoose, { Mongoose, Schema } from "mongoose";

const ResourcesSchema=new mongoose.Schema(
    {
        userId:{
            type:String,
            require:true,
        },
        userName:{
            type:String,
            require:true,
        },
        title:{
            type:String,
            require:true,
        },
        subject:{
            type:String,
            require:true,
        },
        url:{
            type:String,
            require:true,
        },
        date:{
            type:Date,
            require:true,
        },
        domain:{
            type:String,
            require:true,
        },
        description:{
            type:String,
            require:true,
        },
        upvote:{
           
            ids:[{
                type:String
                  }]
        },
        downvote:{
            ids:[{
                type:String
                 }]
        },
        views:{
            type:Number,
            require:true,
            default:0
        }
    }
);
export default mongoose.model("Resource",ResourcesSchema);