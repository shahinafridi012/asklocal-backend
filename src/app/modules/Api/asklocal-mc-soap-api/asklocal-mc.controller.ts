import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { AsklocalMcSoapUserData } from "./asklocal-mc.interface";
import { McSoapUserService } from "./asklocal-mc.service";
import httpStatus from "http-status";

const CreateMcSoapUser = catchAsync(async (req, res) => {
  const payload: AsklocalMcSoapUserData = req.body;

  console.log("Incoming SOAP User:", payload);

  const result = await McSoapUserService.createUser(payload);

  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "SOAP User created + sent to Mortgage Coach",
    data: result,
  });
});


export const AsklocalMcSoapUserController = {
  CreateMcSoapUser,
};
