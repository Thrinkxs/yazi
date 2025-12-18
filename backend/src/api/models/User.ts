import { Document, model, Schema } from "mongoose";


export interface IApplication extends Document {
  job: Schema.Types.ObjectId;
  intern: Schema.Types.ObjectId;
  status: string;
  __v?: number;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    job: { 
      type: Schema.Types.ObjectId,
        ref: "Job",
      required: true,
    },
    intern: {
      type: Schema.Types.ObjectId,
      ref: "Intern",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "interview", "hired"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);


export const Application = model<IApplication>("Application", ApplicationSchema);