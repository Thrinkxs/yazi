import { Document, model, Schema } from "mongoose";


export interface IUser extends Document {
  email: String;
  password: String;

  __v?: number;
}

const UserSchema = new Schema<IUser>(
  {
    email: { 
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    }
  
  },
  {
    timestamps: true,
  }
);


export const User = model<IUser>("User", UserSchema);