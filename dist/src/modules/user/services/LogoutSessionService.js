"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutSessionService = void 0;
const UnauthorizedError_1 = require("@/errors/UnauthorizedError");
const mongodb_1 = require("mongodb");
class LogoutSessionService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(id) {
        const user = await this.userRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(id) },
        });
        if (!user) {
            throw new UnauthorizedError_1.UnauthorizedError('Credenciais inválidas');
        }
        user.refresh_token = null;
        await this.userRepository.save(user);
        return true;
    }
}
exports.LogoutSessionService = LogoutSessionService;
