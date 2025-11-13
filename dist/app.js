"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
// Serve static uploads
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
// Parse JSON requests
app.use(express_1.default.json());
// ✅ CORS setup
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000", // Local Dev
        "" // Production
    ],
    credentials: true,
}));
// routes 
app.use("/api/v1", routes_1.default);
// Test Route
app.get("/", (req, res) => {
    res.send({ message: "Backend is running 🚀" });
});
exports.default = app;
