import { sendEmail } from "../../../utils/Email";
import { generateVerificationCode } from "../../../utils/generateCode";
import { ListingAgentConnect } from "./agentListingConnect.model";

export class ListingAgentConnectService {
  // CREATE OR RETURN USER
  static async createUser(data: {
    license: string;
    agentEmail: string;
    userEmail: string;
    firstName: string;
    lastName: string;
  }) {
    const existing = await ListingAgentConnect.findOne({ userEmail: data.userEmail });
    if (existing) return existing;

    const user = await ListingAgentConnect.create({ ...data, verified: false });
    return user;
  }

  // FIND USER
  static async findByEmail(userEmail: string) {
    return ListingAgentConnect.findOne({ userEmail });
  }

  // SEND OTP
  static async sendVerificationCode(userEmail: string, firstName: string) {
    const code = generateVerificationCode();

    await ListingAgentConnect.findOneAndUpdate({ userEmail }, { code });

    const html = `
      <h2>Your Verification Code</h2>
      <p>Hello ${firstName},</p>
      <p>Your verification code is:</p>
      <h1>${code}</h1>
      <p>This code is valid for 30 minutes.</p>
    `;

    await sendEmail(userEmail, "Your Verification Code", html);
  }

  // VERIFY OTP
  static async verifyCode(userEmail: string, code: string) {
    const user = await ListingAgentConnect.findOne({ userEmail, code });

    if (!user) return false;

    user.verified = true;
    await user.save();

    return user;
  }
}
