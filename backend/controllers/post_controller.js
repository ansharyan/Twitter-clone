import Notification from "../models/notificationSchema.js";
import { Post } from "../models/postSchema.js";
import User from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost =async (req, res) =>{
    try {
        const {text} = req.body;
        let {img} = req.body;
        const userId = req.user._id.toString();

        // const user = await User.findById(userId);
        // if(!user){
        //     return res.status(404).json({error: "User not found!"});
        // }

        if(!img && !text){
            return res.status(400).json({error: "Image or text not provided"});
        }

        if(img){
            const uploadedImg = await cloudinary.uploader.upload(img);
            img = uploadedImg.secure_url;
        }

        const newPost = new Post({
            user : userId,
            text,
            img,
        })

        const post = await  newPost.save();

        return res.status(200).json({message: "Post created successfull", post})
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const likeUnlikePost =async (req, res) =>{
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        let post = await Post.findById(postId);
        let user = await User.findById(userId);

        if(!post){
            res.status(400).json({error: "Post not found!"});
        }

        const isLiked = post.likes.includes(userId);
        if(isLiked){
            //unlike post
            post.likes.pull(userId);
            await post.save();

            user.likedPosts.pull(postId);
            await user.save();

            const updatedLikes = post.likes;
            return res.status(200).json(updatedLikes)
        }else{
            //likepost
            post.likes.push(userId);
            await post.save();

            user.likedPosts.push(postId);
            await user.save();

            const newNotification = Notification({
                type: "like",
                from: userId,
                to: post.user,
            });
            await newNotification.save();
            const updatedLikes = post.likes;
            return res.status(200).json(updatedLikes)
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const commentPost =async (req, res) =>{
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        const {text} = req.body;
        const userId = req.user._id.toString();

        if(!text){
            return res.status(400).json({error: "Comment Text is Required"});
        }

        if(!post){
            return res.status(404).json({error: "Post not found"});
        }

        const comment = {user: userId, text};
        post.comments.push(comment);
        await Post.findByIdAndUpdate(postId, post);

        return res.status(200).json({post, message: "Commented!"});
    } catch (error) {
        
    }
}

export const deletePost =async (req, res) =>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({error: "Post not found!"});
        }

        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({error: "You are not the owner of this post!"})
        }
        if(post.img){
            await cloudinary.uploader.destroy(post.img.split("/").pop().split(".")[0])
        }
        await Post.findByIdAndDelete(req.params.id);
        return res.status(200).json({messsage: "Post Deleted Successfully!"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const getAllPosts = async (req,res) =>{
    try {
        const posts = await Post.find().sort({createdAt: -1})
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password"
            })

        if(posts.length === 0){
            return res.status(200).json({message: "No Post Available"});
        }

        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const getAllLikedPosts = async (req, res) =>{
    try {
        const user = await User.findById(req.params.id).select("-password");
        if(!user){
            return res.status(400).json({error: "User not found!"});        
        }
        
        const likedPosts = await Post.find({_id: {$in : user.likedPosts}})
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password"
            });


        return res.status(200).json(likedPosts);

    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const getFollowingPosts = async(req, res) =>{
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
    
        const following = user.following;
        const feedPosts = await Post.find({user: {$in : following}})
            .sort({createdAt: -1})
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });
        
        return res.status(200).json(feedPosts)
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const getUserPosts = async (req, res) =>{
    try {
        const {username} = req.params;
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({error: "User Not found!"});
        }

        const posts = await Post.find({user: user._id}).sort({createdAt: -1})
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password"
            })
        
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}