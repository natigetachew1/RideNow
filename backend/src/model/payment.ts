import { Schema, model } from "mongoose";
import { IPayment } from "../types/payment";
import { Trip } from "./trip";
import { Profile } from "./profile";

const paymentSchema = new Schema<IPayment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['chapaa'], required: true },
  status: { type: String, enum: ['pending','completed','failed'], default: 'pending' },

}, { timestamps: true });

export const Payment = model<IPayment>('Payment', paymentSchema);
