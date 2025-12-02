import { CookieOptions, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { AuthService } from "./auth.service";
import { NotificationModel } from "../notification/notification.model";

const cookieOpts: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
    | "none"
    | "lax"
    | "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};


export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { admin } = await AuthService.login(email, password);

    await NotificationModel.create({
    title: "Admin Login",
    message: `${email} has logged in as admin.`,
    // type: "adminLogin",
    createdBy: email,
  });

  const token = jwt.sign(
    { id: admin._id.toString(), email: admin.email, role: admin.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
  res
    .cookie("admin_token", token, cookieOpts)
    .status(httpStatus.OK)
    .json({ success: true, message: "Login successful", data: { admin } });
};

export const logout = async (_req: Request, res: Response) => {
  res
    .clearCookie("admin_token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })
    .status(httpStatus.OK)
    .json({ success: true, message: "Logged out" });
};

export const forgotPassword = async (req: Request, res: Response) => {
  await AuthService.forgotPassword(req.body.email);
  res
    .status(httpStatus.OK)
    .json({ success: true, message: "Verification code sent" });
};

export const verifyResetCode = async (req: Request, res: Response) => {
  const result = await AuthService.verifyResetCode(req.body.email, req.body.code);
  res
    .status(httpStatus.OK)
    .json({ success: true, message: "Code verified", data: result });
};

export const resetPassword = async (req: Request, res: Response) => {
  await AuthService.resetPassword(req.body.token, req.body.password);
  res
    .status(httpStatus.OK)
    .json({ success: true, message: "Password reset successful" });
};

export const me = async (req: Request, res: Response) => {
  const user = await AuthService.me(req.user!.id);
  res.status(httpStatus.OK).json({ success: true, data: user });
};
