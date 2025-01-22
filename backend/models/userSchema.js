import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
    },
    fullName:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    follower: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    profileImg: {
        type: String,
        default: "",
    },
    coverImg: {
        type: String,
        default: "",
    },
    bio:{
        type:String,
        default: "",
    },
    link:{
        type: String,
        default:"",
    },
    likedPosts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: [],
    }],

}, { timestamps: true})

const User = mongoose.model("User", userSchema) //users in mongodb

export default User;