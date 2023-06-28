"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const logger_1 = require("@/utils/logger");
const JWT_SECRET = process.env.JWT_SECRET || 'default';
const authenticateToken = async (request, res, next) => {
    const authHeader = request.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            let decoded = await new Promise((resolve, reject) => {
                (0, jsonwebtoken_1.verify)(token, JWT_SECRET, (err, decoded) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(decoded);
                });
            });
            const payload = decoded;
            request.user = payload;
            next();
        }
        catch (error) {
            logger_1.logger.error('authenticateToken() - Error', error);
            return res.status(401).json(error?.message || '');
        }
    }
    else {
        return res.sendStatus(401);
    }
};
exports.authenticateToken = authenticateToken;
