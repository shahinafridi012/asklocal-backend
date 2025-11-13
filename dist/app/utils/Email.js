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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = (to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const GMAIL_USER = process.env.EMAIL_GMAIL_USER;
        const GMAIL_PASS = process.env.EMAIL_GMAIL_PASS;
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL; // optional
        if (!GMAIL_USER || !GMAIL_PASS) {
            throw new Error("❌ Missing EMAIL_GMAIL_USER or EMAIL_GMAIL_PASS in .env");
        }
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: GMAIL_USER,
                pass: GMAIL_PASS,
            },
        });
        yield transporter.sendMail({
            from: `"AskLocal" <${GMAIL_USER}>`,
            to,
            subject,
            html,
            bcc: ADMIN_EMAIL && to !== ADMIN_EMAIL ? ADMIN_EMAIL : undefined,
        });
        console.log(`📩 Email sent to: ${to}`);
    }
    catch (error) {
        console.error("❌ Email sending error:", error.message || error);
    }
});
exports.sendEmail = sendEmail;
