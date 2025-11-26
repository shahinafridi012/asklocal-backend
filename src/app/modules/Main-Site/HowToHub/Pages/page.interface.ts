import { Document, Model } from "mongoose";

export interface PageAttrs {
  title: string;
  sectionTitle?:string;
  slug: string;
  template: "template1" | "template2";
  status: "draft" | "published";
  content: Record<string, any>;
}

export interface PageDoc extends PageAttrs, Document {}

export interface PageModel extends Model<PageDoc> {}
