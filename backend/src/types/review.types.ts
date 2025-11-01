import { Types } from "mongoose";

export interface IReview {
  userId: Types.ObjectId;
  vehicleId: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt?: Date;
}
