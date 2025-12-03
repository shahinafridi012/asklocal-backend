import { Request, Response } from "express";
import httpStatus from "http-status";
import { AuthService } from "./auth.service";
import { CookieOptions } from "express";

const isProduction = process.env.NODE_ENV === "production";

// ✅ Cookie setup for cross-domain (Render ↔ Vercel)
const baseCookie: CookieOptions = {
  httpOnly: true,
  secure: true,             // must be true in Render (HTTPS)
  sameSite: "none",         // must be 'none' for cross-domain
  path: "/",                // apply cookie to all routes
 domain: isProduction ? "asklocal-next-admin-frontend.vercel.app" : "localhost", //  no protocol here
};

// ==========================================================
// ✅ LOGIN CONTROLLER
// ==========================================================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { admin, accessToken, refreshToken } = await AuthService.login(
      email,
      password
    );

    // ✅ Clear old cookies if exist
    res.clearCookie("admin_token", baseCookie);
    res.clearCookie("refresh_token", baseCookie);

    // ✅ Set new cookies for cross-domain
    res.cookie("admin_token", accessToken, {
      ...baseCookie,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("refresh_token", refreshToken, {
      ...baseCookie,
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    });

    // ✅ Add this line so browser accepts cookies from another domain
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
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ success: false, message: err.message });
  }
};

// ==========================================================
// ✅ ME CONTROLLER (Get Profile from token)
// ==========================================================
export const me = async (req: Request, res: Response) => {
  try {
    const user = await AuthService.getProfile(req.user!.id);
    return res.status(httpStatus.OK).json({
      success: true,
      data: user,
    });
  } catch (err: any) {
    console.error("❌ Me endpoint failed:", err.message);
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, message: err.message });
  }
};

// ==========================================================
// ✅ LOGOUT CONTROLLER
// ==========================================================
export const logout = async (_req: Request, res: Response) => {
  try {
    res.clearCookie("admin_token", baseCookie);
    res.clearCookie("refresh_token", baseCookie);

    res.setHeader("Access-Control-Allow-Credentials", "true");

    return res
      .status(httpStatus.OK)
      .json({ success: true, message: "Logged out successfully" });
  } catch (err: any) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, message: err.message });
  }
};
