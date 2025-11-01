import { Schema, model } from "mongoose";
import { IParkingStation } from "../types/parkingStation.types";

const parkingStationSchema = new Schema<IParkingStation>({
  name: { type: String, required: true },
  location: { lat: Number, lng: Number, required: true },
  capacity: { type: Number, required: true },
  occupiedSlots: { type: Number, default: 0 },
});

export const ParkingStation = model<IParkingStation>('ParkingStation', parkingStationSchema);
