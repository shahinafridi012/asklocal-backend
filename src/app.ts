import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());

// IMPORTANT: Handle OPTIONS manually for Vercel
app.options("*", cors());

// Main CORS
app.use(
  cors({
    origin: [
      "https://asklocal.com",
      "https://www.asklocal.com",
      "https://asklocal-client-frontend.vercel.app",
      "http://localhost:3000",
    ],
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
