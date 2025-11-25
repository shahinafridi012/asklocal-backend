import { Model } from "mongoose";

export type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface DayHours {
  open: boolean;
  start: string; // "09:00"
  end: string;   // "17:00"
}

export type OfficeHours = Record<DayKey, DayHours>;

export type AgentStatus = "active" | "inactive";
export interface AgentAttrs {
  first: string;
  last: string;
  email: string;
  pwdHash: string;
  businessName: string;
  lineOfBusiness: string;
  category: string;
  status: AgentStatus;
  descriptionHtml: string;
  agentPhoto?: string;          // ✅ renamed
  businessPhoto?: string;       // ✅ renamed
  locations: string[];
  hours: OfficeHours;

  createdBy?: string;
  updatedBy?: string;
}

export interface AgentDoc extends AgentAttrs, Document {}

export interface AgentModel extends Model<AgentDoc> {}
