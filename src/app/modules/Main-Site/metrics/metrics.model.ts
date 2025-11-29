import mongoose, { Document, Schema } from "mongoose";
import { IMetric } from "./metrics.interface";

export interface IMetricDocument extends IMetric, Document {}

const MetricsSchema = new Schema<IMetricDocument>({
  name: { type: String, required: true },
  value: { type: Number, required: true },
  route: { type: String, required: true },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const MetricsModel =
  mongoose.models.Metrics || mongoose.model<IMetricDocument>("Metrics", MetricsSchema);
