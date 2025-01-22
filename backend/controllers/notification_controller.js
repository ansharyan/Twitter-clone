import mongoose from "mongoose";
import Notification from "../models/notificationSchema.js";

export const getNotifications= async(req, res) =>{
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({to: userId}).populate({
            path:"from",
            select: "username profileImg"
        })

        await Notification.updateMany({to: userId}, {read:true});

        return res.status(200).json(notifications);
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}

export const deleteNotifications = async (req, res) =>{
    try {
        const userId = req.user._id;
        await Notification.deleteMany({to: userId});

        res.status(200).json({message: "Notifications deleted Successfully"});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const deleteNotification = async (req,res) =>{
    try {
        const id = req.params.id;
        const notification = await Notification.findById(id);

        if(!notification){
            return res.status(404).json({error: "Notification Not found"});
        }

        if(notification.to.toString() !== req.user._id.toString()){
            return res.status(403).json({error: "You cannot delete others Notification!"})
        }

        await Notification.findByIdAndDelete(id);

        return res.status(200).json({message: "Notification deleted Successfully"});
    } catch (error) {
        return res.status(500).json({error: error.message});

    }
}