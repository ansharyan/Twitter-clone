import express from "express";
import { protectRoute } from "../middleware.js";
import { followUnfollowUser, getFollowers, getFollowingUsers, getUserProfile, suggestedProfile, updateProfile } from "../controllers/user_controller.js";

const router = express.Router()

router.post("/update", protectRoute, updateProfile)
router.get("/profile/:username", protectRoute,getUserProfile);
router.get("/suggested", protectRoute, suggestedProfile);
router.post("/follow/:id",protectRoute, followUnfollowUser)
router.get("/following/:username", protectRoute, getFollowingUsers);
router.get("/followers/:username", protectRoute, getFollowers);

export default router;
