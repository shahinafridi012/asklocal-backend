import { sendEmail } from "../../../utils/Email";
import { IErrorLog } from "./SentryError.interface";
import { ErrorLog } from "./SentryError.model";

export class ErrorLogService {
  static async createErrorLog(payload: IErrorLog) {
    const log = await ErrorLog.create(payload);

    // Email Admin
    await sendEmail(
      process.env.ADMIN_EMAIL!,
      `🔥 Error Logged (${payload.source})`,
      `
        <h2>🔥 Error Report (${payload.source})</h2>
        <p><strong>Message:</strong> ${payload.message}</p>
        ${payload.route ? `<p><strong>Route:</strong> ${payload.route}</p>` : ""}
        <pre>${payload.stack || ""}</pre>
      `
    );

    return log;
  }

  static async getAll() {
    return ErrorLog.find().sort({ createdAt: -1 });
  }
}
