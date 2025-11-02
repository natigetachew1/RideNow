import { Document } from "mongoose";

export interface IProfile extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: "admin" | "user" | "maintenance";
  balance: number;
  subscriptionStatus: boolean;
  isKYCVerified: boolean;
  idType?: string;
  idNumber?: string;
  licensePhoto?: string;
  livePhoto?: string;
  createdAt: Date;
  updatedAt: Date;
}
