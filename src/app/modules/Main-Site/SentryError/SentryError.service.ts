import { sendEmail } from "../../../utils/Email";
import { IErrorLog } from "./SentryError.interface";
import { ErrorLog } from "./SentryError.model";

export class ErrorLogService {
  // 🔹 Create Log
  static async createErrorLog(payload: IErrorLog) {
    const log = await ErrorLog.create(payload);

    // 📩 Email notification to admin
    try {
      await sendEmail(
        process.env.ADMIN_EMAIL!,
        `🔥 Error Logged (${payload.source})`,
        `
          <h2> Error Report (${payload.source})</h2>
          <p><strong>Message:</strong> ${payload.message}</p>
          ${
            payload.route
              ? `<p><strong>Route:</strong> ${payload.route}</p>`
              : ""
          }
          <pre>${payload.stack || ""}</pre>
        `
      );
    } catch (emailErr) {
      console.warn("⚠️ Email sending failed:", emailErr);
    }

    return log;
  }

  // 🔹 Get all logs
  static async getAll() {
    return ErrorLog.find().sort({ createdAt: -1 });
  }

  // 🔹 Delete by ID
  static async deleteById(id: string) {
    return await ErrorLog.findByIdAndDelete(id);
  }

  // 🔹 Clear all
  static async clearAll() {
    return await ErrorLog.deleteMany({});
  }
}
