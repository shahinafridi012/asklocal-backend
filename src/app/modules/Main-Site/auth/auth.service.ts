import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { AdminModel } from "../admin/admin.model";
import { generateVerificationCode } from "../../../utils/generateCode";
import { sendEmail } from "../../../utils/Email";

export const AuthService = {
  // ✅ Regular login (returns admin only; cookie set in controller)
  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const admin = await AdminModel.findOne({ email: normalizedEmail });
    if (!admin) throw new Error("No admin found with this email");

    const ok = await bcrypt.compare(password.trim(), admin.password);
    if (!ok) throw new Error("Invalid password");

    return { admin };
  },

  // ✅ Forgot password: send 6-digit code
  async forgotPassword(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const admin = await AdminModel.findOne({ email: normalizedEmail });
    if (!admin) throw new Error("No admin found with this email");

    const code = generateVerificationCode(6);
    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    admin.verificationCode = code;
    admin.verificationCodeExpiry = expiry;
    await admin.save();

    await sendEmail(
      admin.email,
      "🔐 Password Reset Verification Code",
      `<p>Your password reset code:</p>
       <h2 style="font-size:28px; color:#4177BC; letter-spacing:3px;">${code}</h2>
       <p>Expires in 10 minutes.</p>`
    );

    return true;
  },

  // ✅ Verify the code and mint a short-lived reset token
  async verifyResetCode(email: string, code: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const admin = await AdminModel.findOne({
      email: normalizedEmail,
      verificationCode: code,
      verificationCodeExpiry: { $gt: new Date() },
    });
    if (!admin) throw new Error("Invalid or expired verification code");

    // clear code
    admin.verificationCode = null;
    admin.verificationCodeExpiry = null;

    const resetToken = crypto.randomBytes(32).toString("hex");
    admin.resetToken = resetToken;
    admin.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await admin.save();

    return { resetToken };
  },

  // ✅ Reset password with token (pre('save') hashes it)
  async resetPassword(token: string, newPassword: string) {
    const admin = await AdminModel.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });
    if (!admin) throw new Error("Invalid or expired reset token");

    admin.password = newPassword; // plain; will be hashed by pre-save
    admin.resetToken = null;
    admin.resetTokenExpiry = null;
    await admin.save();

    return true;
  },

  // ✅ Get current admin (uses req.user injected by middleware)
  async me(adminId: string) {
    return AdminModel.findById(adminId).select("-password");
  },
};
