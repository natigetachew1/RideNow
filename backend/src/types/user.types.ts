import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: 'admin' | 'user' | 'maintenance';
  balance: number;
  subscriptionStatus: boolean;
  isKYCVerified: boolean;
  idType?: string;
  idNumber?: string;
  licensePhoto?: string;
  livePhoto?: string;
  createdAt?: Date;
  updatedAt?: Date;
  
  comparePassword?(candidatePassword: string): Promise<boolean>;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'admin' | 'user' | 'maintenance';
}

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user' | 'maintenance';
  balance: number;
  subscriptionStatus: boolean;
  isKYCVerified: boolean;
  idType?: string;
  idNumber?: string;
  licensePhoto?: string;
  livePhoto?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateUserInput {
  name?: string;
  phone?: string;
  idType?: string;
  idNumber?: string;
  licensePhoto?: string;
  livePhoto?: string;
}

export interface KYCVerificationInput {
  idType: string;
  idNumber: string;
  licensePhoto: string;
  livePhoto: string;
}