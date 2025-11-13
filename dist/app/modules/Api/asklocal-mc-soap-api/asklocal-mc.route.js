"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsklocalMcSoapUserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const asklocal_mc_controller_1 = require("./asklocal-mc.controller");
const router = express_1.default.Router();
// CREATE SOAP USER
router.post("/create-mc-soap-user", asklocal_mc_controller_1.AsklocalMcSoapUserController.CreateMcSoapUser);
// You can add more routes later ↓
// router.get("/all", AsklocalMcSoapUserController.GetAllUsers);
// router.get("/:email", AsklocalMcSoapUserController.GetUserByEmail);
exports.AsklocalMcSoapUserRoutes = router;
