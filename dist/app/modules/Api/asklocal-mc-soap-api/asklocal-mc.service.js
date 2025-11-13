"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.McSoapUserService = void 0;
const asklocal_mc_model_1 = require("./asklocal-mc.model");
const db_1 = require("../../../../db");
const asklocal_mc_soap_service_1 = require("./asklocal-mc.soap.service");
class McSoapUserService {
    static createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, db_1.connectDB)();
            // 1) Save user FAST
            const user = yield asklocal_mc_model_1.McSoapUser.create(data);
            // 2) Background SOAP call
            (0, asklocal_mc_soap_service_1.sendMortgageCoachSOAP)(data.firstName, data.lastName, data.email, data.amount, data.zipCode)
                .then(() => {
                console.log("⚡ SOAP request sent in background");
            })
                .catch((err) => {
                console.error("❌ SOAP request error:", err);
            });
            // 3) Return response immediately (FAST)
            return user;
        });
    }
    static getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, db_1.connectDB)();
            return yield asklocal_mc_model_1.McSoapUser.findOne({ email });
        });
    }
    static getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, db_1.connectDB)();
            return yield asklocal_mc_model_1.McSoapUser.find().sort({ createdAt: -1 });
        });
    }
}
exports.McSoapUserService = McSoapUserService;
