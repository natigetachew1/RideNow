import { Request, Response } from "express";
import { Vehicle } from "../model/vehicle";
import { HTTP_STATUS } from "../constants/status";
import { AuthRequest } from "../middlewares/auth.middleware";

// Create a new vehicle
export const createVehicle = async (req: AuthRequest, res: Response) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(HTTP_STATUS.CREATED).json(vehicle);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error creating vehicle", error });
  }
};

// Get all vehicles
export const getAllVehicles = async (_req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(HTTP_STATUS.OK).json(vehicles);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error fetching vehicles", error });
  }
};

// Get vehicle by ID
export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Vehicle not found" });
    res.status(HTTP_STATUS.OK).json(vehicle);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error fetching vehicle", error });
  }
};

// Update vehicle
export const updateVehicle = async (req: AuthRequest, res: Response) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicle) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Vehicle not found" });
    res.status(HTTP_STATUS.OK).json(vehicle);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error updating vehicle", error });
  }
};

// Delete vehicle
export const deleteVehicle = async (req: AuthRequest, res: Response) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Vehicle not found" });
    res.status(HTTP_STATUS.OK).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error deleting vehicle", error });
  }
};

// Update battery level (example for IoT updates)
export const updateBatteryLevel = async (req: Request, res: Response) => {
  try {
    const { batteryLevel } = req.body;
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, { batteryLevel }, { new: true });
    if (!vehicle) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Vehicle not found" });
    res.status(HTTP_STATUS.OK).json(vehicle);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error updating battery level", error });
  }
};
