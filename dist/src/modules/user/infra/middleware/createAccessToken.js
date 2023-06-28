"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccessToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const logger_1 = require("@/utils/logger");
const JWT_SECRET = process.env.JWT_SECRET || 'default';
const createAccessToken = async (user) => {
    const payload = {
        id: user._id,
        company: user.company_id,
    };
    logger_1.logger.info(payload);
    const accessToken = (0, jsonwebtoken_1.sign)(payload, JWT_SECRET, {
        expiresIn: '15m',
    });
    return accessToken;
};
exports.createAccessToken = createAccessToken;
