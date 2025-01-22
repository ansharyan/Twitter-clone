import express from "express";
import { protectRoute } from "../middleware.js";
import { followUnfollowUser, getUserProfile, suggestedProfile, updateProfile } from "../controllers/user_controller.js";

const router = express.Router()

router.post("/update", protectRoute, updateProfile)
router.get("/profile/:username", protectRoute,getUserProfile);
router.get("/suggested", protectRoute, suggestedProfile);
router.post("/follow/:id",protectRoute, followUnfollowUser)

export default router;
