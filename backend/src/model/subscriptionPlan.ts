import { Schema, model } from "mongoose";
import { ISubscriptionPlan } from "../types/subscriptionPlan.types";

const subscriptionPlanSchema = new Schema<ISubscriptionPlan>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  durationInDays: { type: Number, required: true },
  description: String,
}, { timestamps: true });

export const SubscriptionPlan = model<ISubscriptionPlan>('SubscriptionPlan', subscriptionPlanSchema);
