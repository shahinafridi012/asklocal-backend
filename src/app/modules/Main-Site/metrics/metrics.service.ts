// src/app/modules/metrics/metrics.service.ts
import { MetricsModel } from "./metrics.model";
import { IMetric } from "./metrics.interface";

export class MetricsService {
  static async createMetric(payload: IMetric) {
    return MetricsModel.create(payload);
  }

  static async getAll(limit = 100) {
    return MetricsModel.find().sort({ createdAt: -1 }).limit(limit);
  }

  static async getByRoute(route: string) {
    return MetricsModel.find({ route }).sort({ createdAt: -1 });
  }

  // 🧹 Delete all metrics
  static async clearAll() {
    return MetricsModel.deleteMany({});
  }

  // 🧹 Delete metrics older than N days
  static async cleanupOld(days = 30) {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return MetricsModel.deleteMany({ createdAt: { $lt: cutoff } });
  }
}
