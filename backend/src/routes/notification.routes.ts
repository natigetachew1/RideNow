import express from "express";
import {
  createNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification
} from "../controllers/notification.controller";

const router = express.Router();

router.post("/", createNotification);
router.get("/:userId", getUserNotifications);
router.patch("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

export default router;
