import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

app.use(express.json());

// ---------------------------------------------
// ONLY THIS CORS MIDDLEWARE — NOTHING ELSE
// ---------------------------------------------
app.use(
  cors({
    origin: "https://asklocal-client-frontend.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ---------------------------------------------
// Routes
// ---------------------------------------------
app.use("/api/v1", router);

// Test route
app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Backend is running 🚀" });
});

export default app;
