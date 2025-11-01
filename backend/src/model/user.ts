import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../types/user.types";

const SALT_ROUNDS = 10;

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

userSchema.pre('save', async function (next) {
  const user = this as IUser & Document; 
  if (user.isModified('passwordHash')) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User = model<IUser>('User', userSchema);
