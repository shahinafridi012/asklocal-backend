import { IAdmin } from "./admin.interface";
import { AdminModel } from "./admin.model";

export const AdminService = {
  async createAdmin(data: Partial<IAdmin>) {
    const admin = new AdminModel(data);
    return admin.save();
  },

  async getAllAdmins() {
    return AdminModel.find().sort({ createdAt: -1 });
  },

  async getAdminById(id: string) {
    return AdminModel.findById(id);
  },

  async updateAdmin(id: string, data: Partial<IAdmin>) {
    return AdminModel.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteAdmin(id: string) {
    return AdminModel.findByIdAndDelete(id);
  },
};
