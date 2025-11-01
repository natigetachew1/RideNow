import { Schema, model } from "mongoose";
import { IVehicleType } from "../types/vihecleType.types";

const vehicleTypeSchema = new Schema<IVehicleType>({
  name: { type: String, required: true },
  maxSpeed: { type: Number, required: true },
  batteryCapacity: Number,
});

export const VehicleType = model<IVehicleType>('VehicleType', vehicleTypeSchema);
