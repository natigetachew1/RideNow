// routes/location.routes.ts
import express from "express";
import { addLocation, getAllLocations } from "../controllers/location.controller";

const router = express.Router();

router.post("/", addLocation);
router.get("/", getAllLocations);

export default router;
