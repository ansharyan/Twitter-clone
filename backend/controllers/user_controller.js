import Notification from "../models/notificationSchema.js";
import User from "../models/userSchema.js";
import { v2 as cloudinary } from 'cloudinary'
import bcrypt from "bcryptjs";


export const getUserProfile = async (req, res) =>{
    const {username} = req.params;

    try {
        const user = await User.findOne({username}).select("-password");
        if(!user){
            return res.status(404).json({error: "User not found"});
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const suggestedProfile = async (req, res) =>{
    try {
        const userId = req.user._id;
        const userFollowedByMe = await User.findById(userId).select("following");

        const users = await User.aggregate([
            {
                $match:{
                    _id: {$ne:userId}
                },
            },
            {$sample: {size:10}},
        ]);

        const filteredUsers = users.filter(user => !userFollowedByMe.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0,4)

        suggestedUsers.forEach(user =>user.password = null)

        res.status(200).json(suggestedUsers);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const followUnfollowUser = async (req, res) =>{
    try {
        const {id} = req.params;
        const currentUser = await User.findById(req.user._id);
        const userToModify = await User.findById(id);

        if(req.user._id.toString() === id){
            return res.status(400).json({error: "You cannot follow/unfollow yourself"});
        }

        if(!currentUser || !userToModify){
            return res.status(400).json({error: "User Not found"});
        }

        const isFollowing = currentUser.following.includes(id);
        if(isFollowing){
            //unfollow
            await User.findByIdAndUpdate(id, {$pull : {follower: req.user._id}});
            await User.findByIdAndUpdate(req.user._id, {$pull :{ following: id}});
            res.status(200).json({message: "User Unfollowed!"});
        }else{
            //follow
            await User.findByIdAndUpdate(id, {$push : {follower: req.user._id}});
            await User.findByIdAndUpdate(req.user._id, {$push :{ following: id}});

            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: userToModify._id,
            })
            await newNotification.save();

            res.status(200).json({message: "User Followed!"});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const updateProfile = async (req, res) =>{
    let {fullName, username, email, bio, link, currentPassword, newPassword, profileImg, coverImg} = req.body;
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error: "User not found"});
        }

        if((!currentPassword && newPassword) || (currentPassword && !newPassword)){
            return res.status(400).json({error: "Please provide both current and new password"});
        }

        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if(!isMatch){
                return res.status(400).json({error: "Invalid Password"});
            }
            if(currentPassword === newPassword){
                return res.status(400).json({error: "New password cannot be same as old password"});
            }
            if(newPassword.length < 6){
                return res.status(400).json({error: "Password must be atleast 6 characters long"});
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if(profileImg){
            if(user.profileImg){
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
            }
            const url = await cloudinary.uploader.upload(profileImg)
            profileImg = url.secure_url;
        }
        if(coverImg){
            if(user.coverImg){
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0])
            }
            const url = await cloudinary.uploader.upload(coverImg);
            coverImg = url.secure_url;
        }
        
        user.fullName = fullName || user.fullName;
        user.link = link || user.link;
        user.bio = bio || user.bio;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;
        user.email = email || user.email;

        await user.save();

        user.password = null;//password should be null in response

        return res.status(200).json(user);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const getFollowingUsers = async (req, res) =>{
    try {
        const {username} = req.params;
        const followings = await User.findOne({username}).select("following");
        res.status(200).json(followings.following);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const getFollowers = async (req, res) =>{
    try {
        const {username} = req.params;
        const followers = await User.findOne({username}).select("follower");
        res.status(200).json(followers.follower);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}