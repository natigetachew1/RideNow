import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/model.types";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    phone: { type: String },
    id_type: { type: String },
    id_number: { type: String },
    license_photo: { type: String },
    live_photo: { type: String },
    wallet_balance: { type: Number, default: 0 },
    subscription_status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
