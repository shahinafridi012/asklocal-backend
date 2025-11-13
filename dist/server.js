"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./db");
let server;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("📡 DATABASE_URL:", process.env.DATABASE_URL); // Debug log
            yield (0, db_1.connectDB)();
            const port = process.env.PORT || 5000;
            server = app_1.default.listen(port, () => {
                console.log(`🚀 Server running on http://localhost:${port}`);
            });
        }
        catch (err) {
            console.error("❌ Startup error:", err);
            process.exit(1);
        }
    });
}
main();
// Error handlers
process.on("unhandledRejection", (reason) => {
    console.error("🚨 Unhandled Rejection:", reason);
    if (server)
        server.close(() => process.exit(1));
    else
        process.exit(1);
});
process.on("uncaughtException", (err) => {
    console.error("🚨 Uncaught Exception:", err);
    process.exit(1);
});
