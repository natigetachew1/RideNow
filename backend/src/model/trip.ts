import { ITrip } from "../types/trip.types";
import { Schema, model } from "mongoose";
import { Vehicle } from "./vehicle";
import { Profile } from "./profile";

const tripSchema = new Schema<ITrip>({
  userId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  startTime: { type: Date, required: true },
  endTime: Date,
  startLocation: { lat: Number, lng: Number }, // review 1
  endLocation: { lat: Number, lng: Number }, // review 2
  status: { type: String, enum: ['ongoing','completed','cancelled'], default: 'ongoing' },
}, { timestamps: true });

export const Trip = model<ITrip>('Trip', tripSchema);
