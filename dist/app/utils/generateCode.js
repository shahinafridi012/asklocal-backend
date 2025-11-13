"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationCode = void 0;
const generateVerificationCode = (length = 6) => {
    let code = "";
    for (let i = 0; i < length; i++) {
        code += Math.floor(Math.random() * 10); // 0-9 random
    }
    return code;
};
exports.generateVerificationCode = generateVerificationCode;
