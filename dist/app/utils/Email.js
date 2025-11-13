"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (to, subject, html) => {
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
        await transporter.sendMail({
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
};
exports.sendEmail = sendEmail;
