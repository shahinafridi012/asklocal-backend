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
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const MONGODB_URI = process.env.DATABASE_URL;
if (!MONGODB_URI) {
    throw new Error("❌ DATABASE_URL not set in environment variables");
}
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        if (cached.conn)
            return cached.conn;
        if (!cached.promise) {
            console.log("🔄 Connecting to MongoDB...");
            cached.promise = mongoose_1.default.connect(MONGODB_URI, {
                dbName: "jordan-transportation",
                bufferCommands: false,
                serverSelectionTimeoutMS: 20000, // 20s timeout
            }).then((mongoose) => {
                console.log("✅ MongoDB connected:", mongoose.connection.host);
                return mongoose;
            }).catch((err) => {
                console.error("❌ MongoDB connection error:", err);
                throw err;
            });
        }
        cached.conn = yield cached.promise;
        return cached.conn;
    });
}
