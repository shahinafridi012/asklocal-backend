import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

// ---- FIXED CORS ----
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

// Handle preflight requests explicitly
app.options("*", cors());

// ---- Body Parser ----
app.use(express.json());

// ---- Routes ----
app.use("/api/v1", router);

// Test route
app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Backend is running 🚀" });
});

export default app;
