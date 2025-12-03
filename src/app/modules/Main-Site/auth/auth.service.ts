import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AdminModel } from "../admin/admin.model";

export const AuthService = {
  async login(email: string, password: string) {
    const admin = await AdminModel.findOne({ email: email.toLowerCase().trim() });
    if (!admin) throw new Error("No admin found with this email");

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) throw new Error("Invalid password");

    // ✳️ টোকেন
    const accessToken = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const refreshToken = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "14d" }
    );

    // চাইলে DB তে refreshToken রাখবেন
    admin.refreshToken = refreshToken;
    admin.resetTokenExpiry = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    await admin.save();

    return { admin, accessToken, refreshToken };
  },

  async getProfile(id: string) {
    return AdminModel.findById(id).select("-password");
  },
};
