import { Request, Response } from "express";
import { Trip } from "../model/trip";
import { HTTP_STATUS } from "../constants/status";
import { AuthRequest } from "../middlewares/auth.middleware";

// Create a new trip
export const createTrip = async (req: AuthRequest, res: Response) => {
  try {
    const { vehicleId, startTime, startLocation } = req.body;
    const userId = req.user?.userId;

    const trip = await Trip.create({
      userId,
      vehicleId,
      startTime,
      startLocation,
      status: "ongoing",
    });

    res.status(HTTP_STATUS.CREATED).json(trip);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error creating trip", error });
  }
};

// Get all trips (admin)
export const getAllTrips = async (_req: Request, res: Response) => {
  try {
    const trips = await Trip.find().populate("userId", "name email").populate("vehicleId", "name plateNumber");
    res.status(HTTP_STATUS.OK).json(trips);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error fetching trips", error });
  }
};

// Get trip by ID
export const getTripById = async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("userId", "name email")
      .populate("vehicleId", "name plateNumber");

    if (!trip) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Trip not found" });

    res.status(HTTP_STATUS.OK).json(trip);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error fetching trip", error });
  }
};

// Update trip (end, cancel, etc.)
export const updateTrip = async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!trip) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Trip not found" });

    res.status(HTTP_STATUS.OK).json(trip);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error updating trip", error });
  }
};

// Delete trip
export const deleteTrip = async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);

    if (!trip) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Trip not found" });

    res.status(HTTP_STATUS.OK).json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error deleting trip", error });
  }
};

// Get logged-in user's trips
export const getMyTrips = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const trips = await Trip.find({ userId }).populate("vehicleId", "name plateNumber");

    res.status(HTTP_STATUS.OK).json(trips);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error fetching user trips", error });
  }
};
