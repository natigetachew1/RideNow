import { Schema, model } from 'mongoose';
import { IUser } from '../types/model.types';

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  phone: String,
  role: { type: String, enum: ['admin', 'user', 'maintenance'], default: 'user' },
  walletBalance: { type: Number, default: 0 },
  subscriptionStatus: { type: Boolean, default: false },
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);
