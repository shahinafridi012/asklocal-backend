import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

// Body parser
app.use(express.json());

// -------------------------------------------------
// FIXED OPTIONS HANDLER for Vercel + Express
// -------------------------------------------------
app.options("/*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://asklocal-client-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  return res.status(200).end();
});

// ---------------------------------------------
// Main CORS middleware
// ---------------------------------------------
app.use(
  cors({
    origin: "https://asklocal-client-frontend.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Routes
app.use("/api/v1", router);

// Test route
app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Backend is running 🚀" });
});

export default app;
