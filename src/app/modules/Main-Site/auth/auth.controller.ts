// src/app/modules/Main-Site/auth/auth.controller.ts
import { Request, Response } from "express";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthService } from "./auth.service";
import { AdminModel } from "../admin/admin.model";
import { generateVerificationCode } from "../../../utils/generateCode";
import { sendEmail } from "../../../utils/Email";

/* ==========================================================
   ✅ 1. LOGIN
========================================================== */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { admin, accessToken, refreshToken } = await AuthService.login(email, password);

    return res.status(httpStatus.OK).json({
      success: true,
      message: "Login successful",
      data: {
        id: admin._id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (err: any) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: err.message });
  }
};

/* ==========================================================
   ✅ 2. FORGOT PASSWORD
========================================================== */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const admin = await AdminModel.findOne({ email: email.toLowerCase().trim() });
    if (!admin) throw new Error("No account found with this email");

    const code = generateVerificationCode(6);
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    admin.verificationCode = code;
    admin.verificationCodeExpiry = expiry;
    await admin.save();

    await sendEmail(
      admin.email,
      "Your AskLocal Password Reset Code",
      `
      <h2>🔐 Password Reset Request</h2>
      <p>Hello ${admin.firstName || "User"},</p>
      <p>Your verification code is:</p>
      <h3 style="font-size:24px;letter-spacing:5px;">${code}</h3>
      <p>This code will expire in 10 minutes.</p>
      <br/>
      <p>— AskLocal Security Team</p>
      `
    );

    return res.status(httpStatus.OK).json({
      success: true,
      message: "Verification code sent successfully",
    });
  } catch (err: any) {
    return res.status(httpStatus.BAD_REQUEST).json({ success: false, message: err.message });
  }
};

/* ==========================================================
   ✅ 3. VERIFY CODE
========================================================== */
export const verifyCode = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    const admin = await AdminModel.findOne({ email: email.toLowerCase().trim() });
    if (!admin) throw new Error("Account not found");

    if (
      !admin.verificationCode ||
      admin.verificationCode !== code ||
      !admin.verificationCodeExpiry ||
      new Date(admin.verificationCodeExpiry) < new Date()
    ) {
      throw new Error("Invalid or expired code");
    }

    const resetToken = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET!, {
      expiresIn: "30m",
    });

    admin.resetToken = resetToken;
    admin.verificationCode = null;
    admin.verificationCodeExpiry = null;
    admin.resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000);
    await admin.save();

    return res.status(httpStatus.OK).json({
      success: true,
      message: "Verification successful",
      token: resetToken,
    });
  } catch (err: any) {
    return res.status(httpStatus.BAD_REQUEST).json({ success: false, message: err.message });
  }
};

/* ==========================================================
   ✅ 4. RESET PASSWORD
========================================================== */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) throw new Error("Missing data");

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string };
    const admin = await AdminModel.findById(decoded.id);
    if (!admin) throw new Error("User not found");

    if (!admin.resetToken || admin.resetToken !== token) throw new Error("Invalid reset token");
    if (!admin.resetTokenExpiry || new Date(admin.resetTokenExpiry) < new Date())
      throw new Error("Reset token expired");

    admin.password = password; // pre-save will hash automatically
    admin.resetToken = null;
    admin.resetTokenExpiry = null;
    await admin.save();

    return res.status(httpStatus.OK).json({ success: true, message: "Password updated successfully" });
  } catch (err: any) {
    return res.status(httpStatus.BAD_REQUEST).json({ success: false, message: err.message });
  }
};

/* ==========================================================
   ✅ 5. REFRESH TOKEN / LOGOUT / ME
========================================================== */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new Error("Missing refresh token");

    const { accessToken } = await AuthService.refresh(refreshToken);
    return res.status(httpStatus.OK).json({
      success: true,
      accessToken,
      message: "Access token refreshed successfully",
    });
  } catch (err: any) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: err.message,
    });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const user = await AuthService.getProfile(req.user!.id);
    return res.status(httpStatus.OK).json({ success: true, data: user });
  } catch (err: any) {
    return res.status(httpStatus.BAD_REQUEST).json({ success: false, message: err.message });
  }
};

export const logout = async (_req: Request, res: Response) => {
  return res.status(httpStatus.OK).json({ success: true, message: "Logged out" });
};
