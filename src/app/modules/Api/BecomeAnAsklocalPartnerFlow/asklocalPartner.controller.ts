import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { PartnerFlowService } from "./asklocalPartner.service";
import { MoxoAgentFlowService } from "../Services/moxo.BecomeAsklocalPartnerFlow";
import { NotificationModel } from "../../Main-Site/notification/notification.model";

export class PartnerFlowController {

  // CREATE USER + SEND CODE
  static createUser = catchAsync(async (req, res) => {
    const { firstName, lastName, mlsLicense, email } = req.body;


 await NotificationModel.create({
    title: "New Asklocal Partner Flow User",
    message: `${firstName} ${lastName} has been asklocal Partner Flow Access.`,
    type: "asklocalPartner",
    createdBy: email,
  });
    const user = await PartnerFlowService.createUser({
      firstName,
      lastName,
      mlsLicense,
      email,
    });

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Partner user created",
      data: user,
    });

    // Send OTP asynchronously
    PartnerFlowService.sendVerificationCode(email, firstName)
      .catch(err => console.log("Email send error:", err));
  });

  // VERIFY CODE → ALWAYS START AGENT FLOW AFTER
  static verifyCode = catchAsync(async (req, res) => {
    const { email, code } = req.body;

    const verified = await PartnerFlowService.verifyCode(email, code);

    if (!verified) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Invalid or expired code",
        data: null,
      });
    }

    // Respond to UI
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Email verified",
      data: verified,
    });

    // 🟦 ALWAYS START AGENT FLOW — no extra conditions!
    MoxoAgentFlowService.startAgentFlow({
      firstName: verified.firstName,
      lastName: verified.lastName,
      email: verified.email,
      mlsLicense: verified.mlsLicense,
    }).catch((err: any) => console.log("Agent flow error:", err));
  });

  // RESEND OTP
  static resendCode = catchAsync(async (req, res) => {
    const { email } = req.body;

    const user = await PartnerFlowService.findByEmail(email);
    if (!user) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "User not found",
        data: null,
      });
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Verification code resent",
      data: null,
    });

    PartnerFlowService.sendVerificationCode(email, user.firstName)
      .catch(err => console.log("Resend email error:", err));
  });
}
