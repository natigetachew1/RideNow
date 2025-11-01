export interface ISubscriptionPlan {
  name: string;
  price: number;
  durationInDays: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
