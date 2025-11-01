import { Schema, model, Document } from "mongoose";
import { IUser } from "../types/user.types";

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['admin', 'user', 'maintenance'], default: 'user' },
  balance: { type: Number, default: 0 },
  subscriptionStatus: { type: Boolean, default: false },
  isKYCVerified: { type: Boolean, default: false },
  idType: { type: String },
  idNumber: { type: String },
  licensePhoto: { type: String },
  livePhoto: { type: String },
}, { timestamps: true });



export const User = model<IUser>('User', userSchema);
