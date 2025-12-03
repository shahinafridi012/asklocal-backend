import { AsklocalMcSoapUserData } from "./asklocal-mc.interface";
import { McSoapUser } from "./asklocal-mc.model";
import { connectDB } from "../../../../db";
import { sendMortgageCoachSOAP } from "./asklocal-mc.soap.service";

export class McSoapUserService {
  static async createUser(data: AsklocalMcSoapUserData) {
    await connectDB();

    const user = await McSoapUser.create(data);

    sendMortgageCoachSOAP(
      data.firstName,
      data.lastName,
      data.email,
      data.amount,
      data.zipCode
    )
      .then(() => console.log("⚡ SOAP request sent in background"))
      .catch((err) => console.error("❌ SOAP request error:", err));

    return user;
  }

  static async getUserByEmail(email: string) {
    await connectDB();
    return McSoapUser.findOne({ email });
  }

  static async getAllUsers() {
    await connectDB();
    return McSoapUser.find().sort({ createdAt: -1 });
  }

  // 🔹 Delete user by ID
  static async deleteUser(id: string) {
    await connectDB();
    return McSoapUser.findByIdAndDelete(id);
  }
    static async clearAllUsers() {
    await connectDB();
    await McSoapUser.deleteMany({});
    return true;
  }
}
