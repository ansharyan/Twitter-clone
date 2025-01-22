import e from "express";
import { commentPost, createPost, deletePost, getAllLikedPosts, getAllPosts, getFollowingPosts, getUserPosts, likeUnlikePost } from "../controllers/post_controller.js";
import { protectRoute } from "../middleware.js";


const router = e.Router();

router.get("/all", protectRoute, getAllPosts);
router.get("/following", protectRoute, getFollowingPosts)
router.get('/likedPosts/:id', protectRoute, getAllLikedPosts);
router.get("/user/:username", protectRoute,getUserPosts);
router.post("/create",protectRoute, createPost);
router.post("/like/:id",protectRoute, likeUnlikePost);
router.post("/comment/:id",protectRoute, commentPost);
router.delete("/:id",protectRoute, deletePost);

export default router;