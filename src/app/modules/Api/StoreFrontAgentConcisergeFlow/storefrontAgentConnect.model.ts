import mongoose, { Schema, Document } from "mongoose";

export interface IAgentConnect extends Document {
  fullName: string;
  email: string;
  phone: string;
  agentId?: string;
  agentEmail?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const storefrontAgentConnectSchema = new Schema<IAgentConnect>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    agentId: { type: String },
    agentEmail: { type: String },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const StorefrontAgentConnect = mongoose.model<IAgentConnect>(
  "storefront_agent_connect",
  storefrontAgentConnectSchema
);
