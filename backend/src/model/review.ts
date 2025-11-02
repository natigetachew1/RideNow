import { Schema, model } from "mongoose";
import { IReview } from "../types/review.types";
import { Profile } from "./profile";
import { Vehicle } from "./vehicle";

const reviewSchema = new Schema<IReview>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  rating: { type: Number, required: true },
  comment: String,
}, { timestamps: true });

export const Review = model<IReview>('Review', reviewSchema);
