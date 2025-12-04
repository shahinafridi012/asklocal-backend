import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const Cache = {
  async get<T = any>(key: string): Promise<T | null> {
    try {
      return await redis.get<T>(key);
    } catch (err) {
      console.error("Redis get error:", err);
      return null;
    }
  },
  async set(key: string, value: any, ttlSec = 60) {
    try {
      await redis.set(key, value, { ex: ttlSec });
    } catch (err) {
      console.error("Redis set error:", err);
    }
  },
  async delPrefix(prefix: string) {
    try {
      const keys = (await redis.keys(`${prefix}*`)) || [];
      if (keys.length) await redis.del(...keys);
    } catch (err) {
      console.error("Redis del error:", err);
    }
  },
};
