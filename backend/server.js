import express from "express";
import authRouter from "./routes/auth_route.js"
import dotenv from "dotenv"
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user_route.js";
import {v2 as cloudinary} from "cloudinary";
import postRouter from "./routes/post_route.js";
import notificationRouter from "./routes/notification_route.js";

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const PORT=process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json({limit: "5mb"})); // to parse req.body
app.use(express.urlencoded({extended:true})); //to parse form data url encoded

app.use(cookieParser());  //to get cookies
app.use("/api/auth", authRouter);
app.use('/api/user', userRouter);
app.use("/api/posts", postRouter);
app.use("/api/notifications", notificationRouter)

const connectdb = async () =>{
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Database connected")
    } catch (error) {
        console.log(`MONGODB error: ${error}`);
    }
}

app.listen(PORT, () => {
    console.log(`App is listening on port: ${PORT}`)
    connectdb();
});