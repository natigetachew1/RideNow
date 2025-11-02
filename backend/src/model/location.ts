import { Schema, model } from "mongoose";

interface ILocation {
  lat: number;
  lng: number;
  createdAt?: Date;
}

const locationSchema = new Schema<ILocation>({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
}, { timestamps: true });

export const Location = model<ILocation>('Location', locationSchema);
