"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McSoapUserService = void 0;
const asklocal_mc_model_1 = require("./asklocal-mc.model");
const db_1 = require("../../../../db");
const asklocal_mc_soap_service_1 = require("./asklocal-mc.soap.service");
class McSoapUserService {
    static async createUser(data) {
        await (0, db_1.connectDB)();
        // 1) Save user FAST
        const user = await asklocal_mc_model_1.McSoapUser.create(data);
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
    }
    static async getUserByEmail(email) {
        await (0, db_1.connectDB)();
        return await asklocal_mc_model_1.McSoapUser.findOne({ email });
    }
    static async getAllUsers() {
        await (0, db_1.connectDB)();
        return await asklocal_mc_model_1.McSoapUser.find().sort({ createdAt: -1 });
    }
}
exports.McSoapUserService = McSoapUserService;
