import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/userSchema.js"
import bcrypt from "bcryptjs";

export const signup = async (req, res) =>{
    try {
        const {fullName, username, password, email} = req.body;
        
        //hashpassword
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            username,
            password: hashPassword,
        })

        if(newUser){
            generateTokenAndSetCookie(newUser._id,res);
            await newUser.save();

            res.status(201).json({
                id: newUser._id,
                fullName: newUser.fullName,
                username : newUser.username,
                email: newUser.email,
                follower: newUser.follower,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,

            });
        }else{
            res.status(500).json({error: "Invalid User data"});
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const login = async (req, res) =>{
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if(!user || !isPasswordCorrect){
            return res.status(400).json({error: "Invalid Username or Password"});
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            id: user._id,
            fullName: user.fullName,
            username : user.username,
            email: user.email,
            follower: user.follower,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const logout = async (req, res) =>{
    try {
        res.cookie("jwt", "",{maxAge:0});
        res.status(200).json({message: "Logged Out successfully!"})
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"})
    }
}

export const getMe = async(req, res) =>{
    try {
        const user = await User.findById(req.user._id).select("-password")
        return res.status(200).json(user)
    } catch (error) {
        res.status(500).json("Internal Server error at get me")
    }
}