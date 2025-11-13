"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// ---------------------------------------------
// ONLY THIS CORS MIDDLEWARE — NOTHING ELSE
// ---------------------------------------------
app.use((0, cors_1.default)({
    origin: "https://asklocal-client-frontend.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
// ---------------------------------------------
// Routes
// ---------------------------------------------
app.use("/api/v1", routes_1.default);
// Test route
app.get("/", (req, res) => {
    res.send({ message: "Backend is running 🚀" });
});
exports.default = app;
