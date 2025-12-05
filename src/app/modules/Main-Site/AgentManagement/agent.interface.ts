import { Model, Document } from "mongoose";

export type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface DayHours {
  open: boolean;
  start: string;
  end: string;
}

export type OfficeHours = Record<DayKey, DayHours>;

export type AgentStatus = "active" | "inactive";

export interface Review {
  name: string;
  image?: string;
  rating: number;
  comment: string;
  createdAt?: Date;
}

export interface SocialLinks {
  twitter?: string;
  facebook?: string;
  website?: string;
}

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
  agentPhoto?: string;
  businessPhoto?: string;
  locations: string[];
  hours: OfficeHours;

  foundedYear?: number;
  experienceYears?: number;
  happyCustomers?: number;
  services?: string[];
  reviews?: Review[];
  socialLinks?: SocialLinks;

  createdBy?: string;
  updatedBy?: string;
}

export interface AgentDoc extends AgentAttrs, Document {}
export interface AgentModel extends Model<AgentDoc> {}
