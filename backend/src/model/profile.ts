import { Schema, model, Document } from "mongoose";
import { IProfile } from "../types/profile.types";

const userSchema = new Schema<IProfile>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['admin', 'rent', 'rentee'], default: 'user' },
  balance: { type: Number, default: 0 },
  subscriptionStatus: { type: Boolean, default: false },
  isKYCVerified: { type: Boolean, default: false },
  idType: { type: String },
  idNumber: { type: String },
  licensePhoto: { type: String },
  livePhoto: { type: String },
}, { timestamps: true });



export const Profile = model<IProfile>('Profile', userSchema);
