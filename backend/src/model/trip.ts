import { ITrip } from "../types/trip.types";
import { Schema, model } from "mongoose";
import { Vehicle } from "./vehicle";
import { User } from "./profile";

const tripSchema = new Schema<ITrip>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  startTime: { type: Date, required: true },
  endTime: Date,
  startLocation: { lat: Number, lng: Number },
  endLocation: { lat: Number, lng: Number },
  fare: Number,
  status: { type: String, enum: ['ongoing','completed','cancelled'], default: 'ongoing' },
}, { timestamps: true });

export const Trip = model<ITrip>('Trip', tripSchema);
