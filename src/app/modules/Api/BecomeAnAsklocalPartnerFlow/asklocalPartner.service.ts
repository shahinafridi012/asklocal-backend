import { sendEmail } from "../../../utils/Email";
import { generateVerificationCode } from "../../../utils/generateCode";
import { IPartnerFlow } from "./asklocalPartner.interface";
import { PartnerFlowModel } from "./asklocalPartner.model";


export class PartnerFlowService {
  // CREATE OR RETURN USER
  static async createUser(data: IPartnerFlow) {
    const exists = await PartnerFlowModel.findOne({ email: data.email });
    if (exists) return exists;

    return PartnerFlowModel.create(data);
  }

  // FIND USER
  static async findByEmail(email: string) {
    return PartnerFlowModel.findOne({ email });
  }

  // SEND OTP
  static async sendVerificationCode(email: string, firstName: string) {
    const code = generateVerificationCode();

    await PartnerFlowModel.findOneAndUpdate({ email }, { code });

    const html = `
      <h2>Your AskLocal Partner Verification Code</h2>
      <p>Hello ${firstName},</p>
      <p>Your verification code is:</p>
      <h1>${code}</h1>
      <p>This code is valid for 30 minutes.</p>
    `;

    await sendEmail(email, "AskLocal Partner Verification Code", html);
  }

  // VERIFY OTP
  static async verifyCode(email: string, code: string) {
    const user = await PartnerFlowModel.findOne({ email, code });

    if (!user) return false;

    user.verified = true;
    await user.save();

    return user;
  }
}
