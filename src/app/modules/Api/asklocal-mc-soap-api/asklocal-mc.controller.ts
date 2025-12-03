import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { NotificationModel } from "../../Main-Site/notification/notification.model";
import { AsklocalMcSoapUserData } from "./asklocal-mc.interface";
import { McSoapUserService } from "./asklocal-mc.service";
import httpStatus from "http-status";

const CreateMcSoapUser = catchAsync(async (req, res) => {
  const payload: AsklocalMcSoapUserData = req.body;
  const { firstName, lastName, email } = payload;

  console.log("Incoming SOAP User:", payload);

  const result = await McSoapUserService.createUser(payload);
  await NotificationModel.create({
    title: "New Mortgage Coach SOAP User",
    message: `${firstName} ${lastName} has been applied for Mortgage Coach SOAP Access.`,
    createdBy: email,
  });

  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "SOAP User created + sent to Mortgage Coach",
    data: result,
  });
});

const GetAllMcSoapUsers = catchAsync(async (_req, res) => {
  const users = await McSoapUserService.getAllUsers();

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All SOAP Users fetched successfully.",
    data: users,
  });
});

// 🔹 Delete SOAP User by ID
const DeleteMcSoapUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const deleted = await McSoapUserService.deleteUser(id);

  if (!deleted) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "SOAP User not found.",
      data: undefined,
    });
  }

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "SOAP User deleted successfully.",
    data: undefined,
  });
});
const ClearAllMcSoapUsers = catchAsync(async (_req, res) => {
  await McSoapUserService.clearAllUsers();

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All SOAP users deleted successfully.",
    data: undefined
  });
});

export const AsklocalMcSoapUserController = {
  CreateMcSoapUser,
  GetAllMcSoapUsers,
  DeleteMcSoapUser,
  ClearAllMcSoapUsers 
};
