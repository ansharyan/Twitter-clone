import express from "express";
import { getMe, login, logout, signup } from "../controllers/auth_controller.js";
import { isValidUser, protectRoute } from "../middleware.js";

const router = express.Router();

router.post("/signup",isValidUser ,signup);
router.post("/login", login)
router.post("/logout", logout)
router.get("/me",protectRoute ,getMe);

export default router;