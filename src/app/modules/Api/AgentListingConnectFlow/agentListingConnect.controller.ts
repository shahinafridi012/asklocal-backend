import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { ListingAgentConnectService } from "./agentListingConnect.service";
import { MoxoListingAgentFlowService } from "../Services/moxo.ListingAgentConnectFlow.service";

export class ListingAgentConnectController {
  // CREATE USER + SEND OTP
  static createUser = catchAsync(async (req, res) => {
    const { license, agentEmail, userEmail, firstName, lastName } = req.body;

    const user = await ListingAgentConnectService.createUser({
      license,
      agentEmail,
      userEmail,
      firstName,
      lastName,
    });

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User created successfully",
      data: user,
    });

    // Send OTP asynchronously
    ListingAgentConnectService.sendVerificationCode(userEmail, firstName).catch(
      (err: any) => console.log("Email send error:", err)
    );
  });
  // VERIFY OTP
  static verifyCode = catchAsync(async (req, res) => {
    const { userEmail, code } = req.body;

    const verified = await ListingAgentConnectService.verifyCode(
      userEmail,
      code
    );

    if (!verified) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Invalid or expired code",
        data: null,
      });
    }

    // ✅ Send success response to frontend first
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Email verified successfully",
      data: verified,
    });

    // ✅ Trigger MOXO Workspace Flow (non-blocking)
    MoxoListingAgentFlowService.startListingAgentFlow({
      firstName: verified.firstName,
      lastName: verified.lastName,
      userEmail: verified.userEmail,
      agentEmail: verified.agentEmail,
      license: verified.license,
    }).catch((err) => console.error("❌ Moxo Flow Error:", err.message));
  });

  // RESEND OTP
  static resendCode = catchAsync(async (req, res) => {
    const { userEmail } = req.body;

    const user = await ListingAgentConnectService.findByEmail(userEmail);
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

    ListingAgentConnectService.sendVerificationCode(
      userEmail,
      user.firstName
    ).catch((err: any) => console.log("Resend email error:", err));
  });
}
