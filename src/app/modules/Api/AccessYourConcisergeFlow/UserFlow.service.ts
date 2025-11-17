// UserFlow.service.ts
import { sendEmail } from "../../../utils/Email";
import { generateVerificationCode } from "../../../utils/generateCode";
import { IUserFlow } from "./UserFlow.interface";
import { UserFlowModel } from "./UserFlow.model";

export class UserFlowService {
  static async createUser(data: IUserFlow) {
    const existing = await UserFlowModel.findOne({ email: data.email });
    if (existing) return existing;
    return UserFlowModel.create(data);
  }

  static async updateFlow(email: string, flowType: string) {
    return UserFlowModel.findOneAndUpdate(
      { email },
      { flowType },
      { new: true }
    );
  }

  static async findByEmail(email: string) {
    return UserFlowModel.findOne({ email });
  }

  static async sendVerificationCode(email: string, firstName: string) {
    const code = generateVerificationCode();

    // Save code
    await UserFlowModel.findOneAndUpdate({ email }, { code });

    const html = `
      <h2>Your AskLocal Verification Code</h2>
      <p>Hello ${firstName}, your verification code is:</p>
      <h1>${code}</h1>
      <p>Valid for 30 minutes.</p>
    `;

    // Send email
    await sendEmail(email, "AskLocal Verification Code", html);
  }

  static async verifyCode(email: string, code: string) {
    const user = await UserFlowModel.findOne({ email, code });
    if (!user) return false;

    user.verified = true;
    await user.save();
    return user;
  }
}
