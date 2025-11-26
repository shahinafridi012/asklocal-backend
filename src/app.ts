import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import dotenv from "dotenv";

// Sentry v7 imports
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import { ErrorLogService } from "./app/modules/Main-Site/SentryError/SentryError.service";

dotenv.config();
const app: Application = express();
app.use(express.json());

// ---------------------------------------------
// CORS (UNCHANGED – EXACTLY YOUR CODE)
// ---------------------------------------------
const allowedOrigins = [
  "https://asklocal-client-frontend.vercel.app",
  "https://asklocal-next-admin-frontend.vercel.app",
  "http://localhost:3000",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ------------------------------------------------------
// Sentry Init (v7 – 100% WORKING)
// ------------------------------------------------------
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }), // trace outgoing HTTP
    new Tracing.Integrations.Express({ app }), // trace express routes
  ],
  tracesSampleRate: 1.0,
});

// ------------------------------------------------------
// Sentry Middlewares (MUST BE BEFORE ROUTES)
// ------------------------------------------------------
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// ------------------------------------------------------
// Routes (YOUR API)
// ------------------------------------------------------
app.use("/api/v1", router);

// Test Route
app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Backend is running 🚀" });
});

// Sentry Test Route
// app.get("/test-error", () => {
//   throw new Error("🔥 Testing Sentry error from backend!");
// });

// ------------------------------------------------------
// Sentry Error Handler (MUST BE BEFORE custom handler)
// ------------------------------------------------------
app.use(Sentry.Handlers.errorHandler());

// ------------------------------------------------------
// Custom Error Handler (UNCHANGED – MUST BE LAST)
// ------------------------------------------------------
app.use(async (err: any, req: Request, res: Response, next: any) => {
  console.error("🔥 Backend Error:", err);

  await ErrorLogService.createErrorLog({
    source: "backend",
    message: err.message,
    stack: err.stack,
    route: req.originalUrl,
    method: req.method,
    statusCode: res.statusCode,
    user: undefined,
    extra: req.body,
  });

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

export default app;
