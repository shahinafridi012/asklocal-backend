// UserFlowController.ts
import httpStatus from "http-status";
import { UserFlowService } from "./UserFlow.service";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { MoxoService } from "../Services/moxo.UserFlowServices";

export class UserFlowController {
  // CREATE USER (super fast)
  static createUser = catchAsync(async (req, res) => {
    const { firstName, lastName, email } = req.body;

    // Save user or return existing user
    const user = await UserFlowService.createUser({
      firstName,
      lastName,
      email,
    });

    // ⭐ Respond instantly
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User created",
      data: user,
    });

    // ⭐ Send OTP email in background
    UserFlowService.sendVerificationCode(email, firstName).catch(err =>
      console.error("Email Error:", err)
    );
  });

  // UPDATE FLOW
  static updateFlow = catchAsync(async (req, res) => {
    const { email, flowType } = req.body;
    const updatedUser = await UserFlowService.updateFlow(email, flowType);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Flow updated",
      data: updatedUser,
    });
  });

  // VERIFY OTP
  static verifyCode = catchAsync(async (req, res) => {
    const { email, code } = req.body;

    const verifiedUser = await UserFlowService.verifyCode(email, code);
    if (!verifiedUser) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Invalid or expired code",
        data: null,
      });
    }

    const { firstName, lastName, flowType } = verifiedUser;

    // respond fast
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Email verified",
      data: { firstName, lastName, email, flowType },
    });

    // Run Moxo flow in background
    if (flowType) {
      MoxoService.startFlow({ firstName, lastName, email, flowType }).catch(err =>
        console.error("Moxo Error:", err)
      );
    }
  });

  // RESEND CODE
  static resendCode = catchAsync(async (req, res) => {
    const { email } = req.body;

    const user = await UserFlowService.findByEmail(email);
    if (!user) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "User not found",
        data: undefined
      });
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "New verification code sent",
      data: undefined
    });

    UserFlowService.sendVerificationCode(email, user.firstName).catch(err =>
      console.error("Email Error:", err)
    );
  });
}
