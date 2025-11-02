import { Document } from "mongoose";

export interface IUser extends Document {
    profileId: import("mongoose").Types.ObjectId;
}