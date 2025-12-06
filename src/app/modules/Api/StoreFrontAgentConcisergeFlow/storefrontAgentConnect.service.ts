import { StorefrontAgentConnect } from "./storefrontAgentConnect.model";

export const StorefrontAgentConnectService = {
  // ✅ Create
  async create(data: any) {
    return await StorefrontAgentConnect.create(data);
  },

  // ✅ Get All
  async getAll() {
    return await StorefrontAgentConnect.find().sort({ createdAt: -1 });
  },

  // ✅ Get One by ID
  async getById(id: string) {
    return await StorefrontAgentConnect.findById(id);
  },

  // ✅ Update
  async update(id: string, payload: any) {
    return await StorefrontAgentConnect.findByIdAndUpdate(id, payload, {
      new: true,
    });
  },

  // ✅ Delete
  async remove(id: string) {
    return await StorefrontAgentConnect.findByIdAndDelete(id);
  },
};
