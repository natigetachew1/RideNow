import { Document } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: 'admin' | 'user' | 'maintenance';
  walletBalance: number;
  subscriptionStatus: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
