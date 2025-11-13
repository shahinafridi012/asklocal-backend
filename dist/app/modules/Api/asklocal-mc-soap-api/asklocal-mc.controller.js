"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsklocalMcSoapUserController = void 0;
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const asklocal_mc_service_1 = require("./asklocal-mc.service");
const http_status_1 = __importDefault(require("http-status"));
const CreateMcSoapUser = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    console.log("Incoming SOAP User:", payload);
    const result = await asklocal_mc_service_1.McSoapUserService.createUser(payload);
    return (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "SOAP User created + sent to Mortgage Coach",
        data: result,
    });
});
exports.AsklocalMcSoapUserController = {
    CreateMcSoapUser,
};
