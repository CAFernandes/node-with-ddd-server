"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'default';
const createRefreshToken = async (user) => {
    const payload = {
        id: user._id,
    };
    const refreshToken = (0, jsonwebtoken_1.sign)(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });
    return refreshToken;
};
exports.createRefreshToken = createRefreshToken;
