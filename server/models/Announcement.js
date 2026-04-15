// models/Announcement.js

import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({

    community:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Community"
    },

    title:{
        type:String
    },

    message:{
        type:String
    },

    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},{timestamps:true});

export default mongoose.model("Announcement",announcementSchema);