import e from "express";
import { protectRoute } from "../middleware.js";
import { deleteNotification, deleteNotifications, getNotifications } from "../controllers/notification_controller.js";

const router = e.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/", protectRoute, deleteNotifications);
router.delete("/:id", protectRoute, deleteNotification)


export default router;