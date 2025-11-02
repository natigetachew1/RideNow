import { IUser } from "../types/user.type";
import { model } from "mongoose";
import { Profile } from "./profile";
import { Schema } from "mongoose";

const userSchema = new Schema({
    profileId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
});

export const User = model<IUser>('User', userSchema);