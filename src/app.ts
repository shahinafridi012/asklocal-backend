import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

app.use(express.json());

// ✅ CORS — allow only one origin at a time
const allowedOrigins = [
  "https://asklocal-client-frontend.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow Postman/servers
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
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
