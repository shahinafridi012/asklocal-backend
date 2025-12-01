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

export const AsklocalMcSoapUserController = {
  CreateMcSoapUser,
};
