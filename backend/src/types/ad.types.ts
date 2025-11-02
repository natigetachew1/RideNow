import { Document, Types } from "mongoose";

export interface IAd extends Document {
  userId: Types.ObjectId; 
  vehicleId: Types.ObjectId; 
  price: number;
  status: "active" | "inactive";
  businessType: "rent" | "deliveryy";
  starReview: number;
  isNegotiable: boolean;
  location: {
    lat: number;
    lng: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
