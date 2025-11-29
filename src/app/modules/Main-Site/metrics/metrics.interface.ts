export interface IMetric {
  name: string;       // e.g. LCP, FID, CLS, TTFB
  value: number;      // numeric metric value
  route: string;      // page where metric was collected
  userAgent?: string; // browser info
  createdAt?: Date;
}
