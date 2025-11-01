import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password_hash: string;
  phone?: string;
  id_type?: string;
  id_number?: string;
  license_photo?: string;
  live_photo?: string;
  wallet_balance: number;
  subscription_status: boolean;
  createdAt: Date;
  updatedAt: Date;
}
