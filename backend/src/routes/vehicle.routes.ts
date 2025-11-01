import { Router } from "express";
import {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  updateBatteryLevel,
} from "../controllers/vehicle.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/role.middleware";

const router = Router();

router.post("/", authMiddleware, adminMiddleware, createVehicle);
router.put("/:id", authMiddleware, adminMiddleware, updateVehicle);
router.delete("/:id", authMiddleware, adminMiddleware, deleteVehicle);

router.get("/", getAllVehicles);
router.get("/:id", getVehicleById);


router.patch("/:id/battery", updateBatteryLevel);

export default router;
