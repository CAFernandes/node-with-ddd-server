"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshJwtToken = void 0;
const mongodb_1 = require("mongodb");
const jsonwebtoken_1 = require("jsonwebtoken");
const UnauthorizedError_1 = require("@/errors/UnauthorizedError");
const createAccessToken_1 = require("@user/infra/middleware/createAccessToken");
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'default';
class RefreshJwtToken {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(refreshToken) {
        const decoded = await new Promise((resolve, reject) => {
            (0, jsonwebtoken_1.verify)(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
                if (err)
                    return reject(err);
                resolve(decoded);
            });
        });
        const payload = decoded;
        const id = payload.id;
        const user = await this.userRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(id) },
        });
        if (!user) {
            throw new UnauthorizedError_1.UnauthorizedError('Credenciais inválidas');
        }
        return await (0, createAccessToken_1.createAccessToken)(user);
    }
}
exports.RefreshJwtToken = RefreshJwtToken;
