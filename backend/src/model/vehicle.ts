import { IVehicle } from "../types/vehicle.types";
import { Schema, model } from "mongoose";

const vehicleSchema = new Schema<IVehicle>({
  vehicleType: { type: String, enum: ['scooter', 'bike'], required: true },
  model: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  batteryLevel: { type: Number, default: 100 },
  location: { lat: Number, lng: Number },
  status: { type: String, enum: ['available','in_use','maintenance'], default: 'available' },
  lastMaintenance: Date,
}, { timestamps: true });

export const Vehicle = model<IVehicle>('Vehicle', vehicleSchema);
