import { Profile } from "./profile";
import { Vehicle } from "./vehicle";
import { Schema, model } from "mongoose";
import { IAd } from "../types/ad.types";
import { Location } from "./location";

const adSchema = new Schema<IAd>({
    userId: { type: Schema.Types.ObjectId, ref: 'Profile',},
    vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
    price: { type: Number, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    businessType: { type: String, enum: ['rent', 'deliveryy'], required: true },
    starReview : { type: Number, default: 0 },
    isNegotiable: { type: Boolean, default: false },
    location: {type : Schema.Types.ObjectId, ref: 'Location'}
});

export const Ad = model('Ad', adSchema);