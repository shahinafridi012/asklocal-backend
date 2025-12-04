import { Router } from "express";
import { Cache } from "../../shared/redis";

const router = Router();

router.get("/redis-test", async (_req, res) => {
  try {
    await Cache.set("hello", { msg: "world" }, 30);
    const data = await Cache.get("hello");
    res.json({ success: true, data });
  } catch (err) {
    console.error("Redis test error:", err);
    res.status(500).json({ success: false, message: "Redis test failed" });
  }
});

export const TestRoutes = router;
