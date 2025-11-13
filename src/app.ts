import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import dotenv from "dotenv";
dotenv.config();

const app: Application = express();

// ---- GLOBAL CORS (Supports Vercel Serverless) ----
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://asklocal-client-frontend.vercel.app",
    "https://asklocal.com",
    "https://www.asklocal.com",
    "http://localhost:3000",
  ];

  const origin = req.headers.origin as string;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  // Preflight Request
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Body parser
app.use(express.json());

// API Routes
app.use("/api/v1", router);

// Root
app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Backend is running 🚀" });
});

export default app;
