import mongoose, { Schema } from "mongoose";
import { AgentDoc, AgentModel, DayHours } from "./agent.interface";

const dayHours: Record<string, any> = {
  open: { type: Boolean, default: true },
  start: { type: String, default: "09:00" },
  end: { type: String, default: "17:00" },
};

const OfficeHoursSchema = new Schema<Record<string, DayHours>>(
  {
    Mon: { type: Object, default: dayHours },
    Tue: { type: Object, default: dayHours },
    Wed: { type: Object, default: dayHours },
    Thu: { type: Object, default: dayHours },
    Fri: { type: Object, default: dayHours },
    Sat: { type: Object, default: { open: false, start: "10:00", end: "14:00" } },
    Sun: { type: Object, default: { open: false, start: "10:00", end: "14:00" } },
  },
  { _id: false }
);

const AgentSchema = new Schema<AgentDoc, AgentModel>(
  {
    first: { type: String, required: true, trim: true },
    last: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    pwdHash: { type: String, required: true },
    businessName: { type: String, required: true, trim: true },
    lineOfBusiness: { type: String, default: "", trim: true },
    category: { type: String, default: "Real Estate", trim: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    descriptionHtml: { type: String, default: "" },
    agentPhoto: { type: String, default: "" },        // 
    businessPhoto: { type: String, default: "" },     // 
    locations: { type: [String], default: [] },
    hours: { type: OfficeHoursSchema, default: undefined },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  { timestamps: true }
);

export const Agent = mongoose.model<AgentDoc, AgentModel>("Agent", AgentSchema);
