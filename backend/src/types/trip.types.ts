import { Types } from "mongoose";

export interface ITrip {
  userId: Types.ObjectId;
  vehicleId: Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  startLocation: { lat: number; lng: number };
  endLocation?: { lat: number; lng: number };
  fare?: number;
  status: 'ongoing' | 'completed' | 'cancelled';
}
