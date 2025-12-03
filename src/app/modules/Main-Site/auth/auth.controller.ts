import { Request, Response } from "express";
import httpStatus from "http-status";
import { AuthService } from "./auth.service";

// ==========================================================
// ✅ LOGIN CONTROLLER — Return tokens in JSON
// ==========================================================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { admin, accessToken, refreshToken } = await AuthService.login(email, password);

    console.log(`✅ Admin login successful: ${admin.email} (${admin.role})`);

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
    console.error("❌ Login failed:", err.message);
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: err.message });
  }
};

// ==========================================================
// ✅ ME CONTROLLER — Protected by Bearer token
// ==========================================================
export const me = async (req: Request, res: Response) => {
  try {
    const user = await AuthService.getProfile(req.user!.id);
    return res.status(httpStatus.OK).json({ success: true, data: user });
  } catch (err: any) {
    return res.status(httpStatus.BAD_REQUEST).json({ success: false, message: err.message });
  }
};

// ==========================================================
// ✅ LOGOUT CONTROLLER
// ==========================================================
export const logout = async (_req: Request, res: Response) => {
  return res.status(httpStatus.OK).json({ success: true, message: "Logged out" });
};
