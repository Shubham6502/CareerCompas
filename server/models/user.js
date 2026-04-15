import mongoose from 'mongoose';
const UserSchema=new mongoose.Schema({
    _id:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    passwordHash:{
        type:String,
        required:true
    },
    displayName:{
        type:String,
    },
    profilePicture:{
        type:String,
        default:'',
    },
    role:{
        type:String,
        enum:['user','admin','moderator'],
        default:'user'
    },
    bio:{
        type:String,
        default:''
    },
    status:{
        type:String,
        enum:['open to work','actively looking','not looking'],
        default:'open to work'  

    },
    badges:[String],
    socialLinks:{
        linkedin:String,
        github:String,
        twitter:String,
        personalWebsite:String
    },
    education:[{
        degree:String,
        start:String,
        end:String,
       
        description:String
    }],
    experience:[
        {
            
            role:String,
            start:String,
            end:{type:String,default:'present'},
            description:String,
            isPresent:{
                type:Boolean,
                default:false
            }
        }
    ],
    isVerified:{
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
    },
    lastActiveAt:{
        type:Date,
        default:Date.now
    }
})
export default mongoose.model('User',UserSchema)   