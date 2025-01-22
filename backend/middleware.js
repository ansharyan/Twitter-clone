import User from "./models/userSchema.js";
import jwt from "jsonwebtoken";


export const isValidUser = async (req,res,next) =>{
    try {
        const {fullName, username, password, email} = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({error: "Invalid Email Format"});
        }

        const existingUser = await User.findOne({ username });
        if(existingUser){
            return res.status(400).json({error: "Username already taken!"});
        }

        const existingEmail = await User.findOne({ email });
        if(existingEmail){
            return res.status(400).json({error: "User with same email exists!"});
        }

        //hashPassword
        if(password.length <6 ){
            return res.status(400).json({error: "Password length shoull be greater than 6"});
        }

        next();
    } catch (err) {
        console.log(err)
        return err;
    }
}

export const protectRoute = async(req, res,next) =>{
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({error: "You need to login first"});
        }
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({error: "Unauthorised: Invalid token"});
        }
    
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(404).json({error: "User not found"})
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}