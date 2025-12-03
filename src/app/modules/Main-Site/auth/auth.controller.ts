import { Request, Response, CookieOptions } from "express";
import httpStatus from "http-status";
import { AuthService } from "./auth.service";

const isProduction = process.env.NODE_ENV === "production";

// ✅ Cookie setup (safe for Render ↔ Vercel)
const baseCookie: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/", // no domain — let browser attach automatically to backend domain
};

// ==========================================================
// ✅ LOGIN CONTROLLER
// ==========================================================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { admin, accessToken, refreshToken } = await AuthService.login(email, password);

    // Clear old cookies first
    res.clearCookie("admin_token", baseCookie);
    res.clearCookie("refresh_token", baseCookie);

    // Set new cookies (Render will serve under its own domain)
    res.cookie("admin_token", accessToken, { ...baseCookie, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.cookie("refresh_token", refreshToken, { ...baseCookie, maxAge: 14 * 24 * 60 * 60 * 1000 });

    res.setHeader("Access-Control-Allow-Credentials", "true");

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
    });
  } catch (err: any) {
    console.error("❌ Login failed:", err.message);
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: err.message });
  }
};

// ==========================================================
// ✅ ME CONTROLLER
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
  res.clearCookie("admin_token", baseCookie);
  res.clearCookie("refresh_token", baseCookie);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  return res.status(httpStatus.OK).json({ success: true, message: "Logged out" });
};
