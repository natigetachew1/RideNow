import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  getProfile,
  updateUser,
  deleteUser,
} from "../controllers/userController";

import { authMiddleware } from "../middlewares/auth.middleware"; 

const router = Router();

router.post("/", createUser);
router.get("/", authMiddleware, getUsers);
router.get("/profile", authMiddleware, getProfile);
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;
