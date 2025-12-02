import { CookieOptions, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { AuthService } from "./auth.service";
import { NotificationModel } from "../notification/notification.model";

// ✅ dynamic cookie options for local + production
const isProduction = process.env.NODE_ENV === "production";

const cookieOpts: CookieOptions = {
  httpOnly: true,
  secure: isProduction, // true on render/vercel (HTTPS)
  sameSite: isProduction ? "none" : "lax",
  path: "/", // global
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { admin } = await AuthService.login(email, password);

  const token = jwt.sign(
    { id: admin._id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  await NotificationModel.create({
    title: "Admin Login",
    message: `${email} logged in as admin.`,
    createdBy: email,
  });

  res
    .cookie("admin_token", token, cookieOpts)
    .status(httpStatus.OK)
    .json({
      success: true,
      message: "Login successful",
      data: { admin },
    });
};

// ✅ LOGOUT
export const logout = async (_req: Request, res: Response) => {
  res
    .clearCookie("admin_token", { ...cookieOpts, maxAge: undefined })
    .status(httpStatus.OK)
    .json({ success: true, message: "Logged out successfully" });
};

// ✅ FORGOT PASSWORD
export const forgotPassword = async (req: Request, res: Response) => {
  await AuthService.forgotPassword(req.body.email);
  res
    .status(httpStatus.OK)
    .json({ success: true, message: "Verification code sent" });
};

// ✅ VERIFY RESET CODE
export const verifyResetCode = async (req: Request, res: Response) => {
  const result = await AuthService.verifyResetCode(
    req.body.email,
    req.body.code
  );
  res
    .status(httpStatus.OK)
    .json({ success: true, message: "Code verified", data: result });
};

// ✅ RESET PASSWORD
export const resetPassword = async (req: Request, res: Response) => {
  await AuthService.resetPassword(req.body.token, req.body.password);
  res
    .status(httpStatus.OK)
    .json({ success: true, message: "Password reset successful" });
};

// ✅ GET CURRENT ADMIN
export const me = async (req: Request, res: Response) => {
  const user = await AuthService.me(req.user!.id);
  res.status(httpStatus.OK).json({ success: true, data: user });
};
