import mongoose, { Schema, model } from "mongoose";
import { ListingAgentConnectInfo } from "./agentListingConnect.interfcae";

const ListingAgentConnectSchema = new Schema<ListingAgentConnectInfo>(
  {
    license: { type: String, required: true },
    agentEmail: { type: String, required: true },
    userEmail: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    code: { type: String },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ListingAgentConnect = model(
  "ListingAgentConnect",
  ListingAgentConnectSchema
);
