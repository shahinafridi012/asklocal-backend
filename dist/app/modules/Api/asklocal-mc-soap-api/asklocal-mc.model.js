"use strict";
// src/models/McSoapUser.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.McSoapUser = void 0;
const mongoose_1 = require("mongoose");
const McSoapUserSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, index: true },
    currency: { type: String, required: true },
    amount: { type: Number, required: true },
    zipCode: { type: String, required: true },
    additionalMassage: { type: String },
    // System fields
    verified: { type: Boolean, default: false },
    tcaReportXml: { type: String },
}, { timestamps: true });
exports.McSoapUser = mongoose_1.models.McSoapUser || (0, mongoose_1.model)("AsklocalMcSoapUser", McSoapUserSchema);
