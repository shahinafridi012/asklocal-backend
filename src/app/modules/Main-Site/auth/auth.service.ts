// src/app/modules/Main-Site/auth/auth.service.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AdminModel } from "../admin/admin.model";

export const AuthService = {
  /* ==========================================================
     ✅ LOGIN — Verifies email/password and returns tokens
  ========================================================== */
  async login(email: string, password: string) {
    const admin = await AdminModel.findOne({ email: email.toLowerCase().trim() });
    if (!admin) throw new Error("No admin found with this email");

    console.log("📩 Login attempt:", email);

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) throw new Error("Invalid password");

    // ✅ Create access token (1h)
    const accessToken = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // ✅ Create refresh token (7 days)
    const refreshToken = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    admin.refreshToken = refreshToken;
    admin.resetTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await admin.save();

    console.log("✅ Login successful:", admin.email);

    return { admin, accessToken, refreshToken };
  },

  /* ==========================================================
     ✅ GET PROFILE
  ========================================================== */
  async getProfile(id: string) {
    const user = await AdminModel.findById(id).select("-password -refreshToken");
    if (!user) throw new Error("User not found");
    return user;
  },

  /* ==========================================================
     ✅ REFRESH TOKEN
  ========================================================== */
  async refresh(oldRefreshToken: string) {
    try {
      const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET!) as {
        id: string;
        email: string;
      };

      const admin = await AdminModel.findById(decoded.id);
      if (!admin || admin.refreshToken !== oldRefreshToken)
        throw new Error("Invalid refresh token");

      // ✅ Create new 1h access token
      const newAccessToken = jwt.sign(
        { id: admin._id, email: admin.email, role: admin.role },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      return { accessToken: newAccessToken };
    } catch {
      throw new Error("Refresh token expired or invalid");
    }
  },
};
