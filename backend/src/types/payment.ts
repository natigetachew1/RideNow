import { Types } from "mongoose";

export interface IPayment {
  userId: Types.ObjectId;
  tripId: Types.ObjectId;
  amount: number;
  method: 'card' | 'wallet' | 'cash';
  status: 'pending' | 'completed' | 'failed';
  createdAt?: Date;
  updatedAt?: Date;
}


