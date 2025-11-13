import { AsklocalMcSoapUserData } from "./asklocal-mc.interface";
import { McSoapUser } from "./asklocal-mc.model";
import { connectDB } from "../../../../db";
import { sendMortgageCoachSOAP } from "./asklocal-mc.soap.service";

export class McSoapUserService {
  static async createUser(data: AsklocalMcSoapUserData) {
    await connectDB();

    // 1) Save user FAST
    const user = await McSoapUser.create(data);

    // 2) Background SOAP call
    sendMortgageCoachSOAP(
      data.firstName,
      data.lastName,
      data.email,
      data.amount,
      data.zipCode
    )
      .then(() => {
        console.log("⚡ SOAP request sent in background");
      })
      .catch((err) => {
        console.error("❌ SOAP request error:", err);
      });

    // 3) Return response immediately (FAST)
    return user;
  }

  static async getUserByEmail(email: string) {
    await connectDB();
    return await McSoapUser.findOne({ email });
  }

  static async getAllUsers() {
    await connectDB();
    return await McSoapUser.find().sort({ createdAt: -1 });
  }
}
