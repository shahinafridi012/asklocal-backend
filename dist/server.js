"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const app_1 = __importDefault(require("./app"));
const db_1 = require("./db");
// Detect if running on Vercel serverless
const isVercel = !!process.env.VERCEL;
// Cache DB connection in memory for Vercel
let isConnected = false;
async function handler(req, res) {
    // Vercel serverless mode
    if (isVercel) {
        if (!isConnected) {
            await (0, db_1.connectDB)();
            isConnected = true;
        }
        // Let Express handle everything
        return app_1.default(req, res);
    }
}
// LOCAL DEVELOPMENT MODE -->
if (!isVercel) {
    (async () => {
        try {
            await (0, db_1.connectDB)();
            const port = process.env.PORT || 5000;
            app_1.default.listen(port, () => {
                console.log(`🚀 Local server running at http://localhost:${port}`);
            });
        }
        catch (error) {
            console.error("❌ Local server failed:", error);
        }
    })();
}
