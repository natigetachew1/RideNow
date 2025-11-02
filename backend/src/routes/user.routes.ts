import { Router } from "express";
import { registerUser, loginUser, getProfile, updateProfile } from "../controllers/userController";
import { authMiddleware,authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authenticateJWT, getProfile);
router.put("/profile", authMiddleware, updateProfile);

export default router;
