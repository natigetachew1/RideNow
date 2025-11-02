import { Request, Response } from "express";
import { Location } from "../model/location";

export const addLocation = async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.body;
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    const location = await Location.create({ lat, lng });
    res.status(201).json({ message: "Location saved", location });
  } catch (error) {
    res.status(500).json({ message: "Error saving location", error });
  }
};


export const getAllLocations = async (req: Request, res: Response) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching locations", error });
  }
};
