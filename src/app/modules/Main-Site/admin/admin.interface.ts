// src/app/modules/Admin/admin.interface.ts

export interface IAdmin {
  firstName: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  password: string;
  role: "Admin" | "Manager" | "Editor";
  status: "Active" | "Inactive";
  profileImage?: string;

  // 🔹 Add these for authentication features
  verificationCode?: string | null;
  verificationCodeExpiry?: Date | null;
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
  refreshToken?: string | null;
}
