import { Router } from "express";
import {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getMyTrips,
} from "../controllers/trip.controller";
import { authMiddleware, authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();

// Authenticated routes
router.post("/", authMiddleware, createTrip);
router.get("/my", authMiddleware, getMyTrips);

// Public/admin routes
router.get("/", getAllTrips);
router.get("/:id", getTripById);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);

export default router;
