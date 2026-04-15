import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
{ 
    communityId:{
         type:String,
         unique:true
    },
    name: {
        type: String,
        required: true
    },

    code: {
        type: String,
        
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    members: [
        {
            user: {
                type:String,
            },
            username:{
                    type: String
            },

            role: {
                type: String,
                enum: ["owner","admin","member"],
                default: "member"
            },
            joinedAt: {
                type: Date,
                default: Date.now
            },
            blocked: {
                type: Boolean,
                default: false
            }
        }
    ],

    joinRequests: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            status: {
                type: String,
                enum: ["pending","approved","rejected"],
                default: "pending"
            },
            requestedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]

},
{ timestamps:true }
);
communitySchema.index({ communityId: 1 });
communitySchema.index({ owner: 1 }); 
communitySchema.index({ "members.user": 1 });

export default mongoose.model("Community",communitySchema);