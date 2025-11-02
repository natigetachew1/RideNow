import { IVehicle } from "../types/vehicle.types";
import { Schema, model } from "mongoose";

const vehicleSchema = new Schema<IVehicle>({
  vehicleType: { type: String, enum: ['scooter', 'bike'], required: true },
  model: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  location: { lat: Number, lng: Number },
  status: { type: String, enum: ['forRent','forDelivery','inAvailable'] },
  lastMaintenance: Date,
}, { timestamps: true });

export const Vehicle = model<IVehicle>('Vehicle', vehicleSchema);
