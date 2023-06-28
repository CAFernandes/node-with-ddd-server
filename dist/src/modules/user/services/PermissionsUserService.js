"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsUserService = void 0;
const NotFound_1 = require("@/errors/NotFound");
const getAdminPermissions_1 = require("@user/infra/middleware/getAdminPermissions");
const getUserPermissions_1 = require("@user/infra/middleware/getUserPermissions");
const mongodb_1 = require("mongodb");
class PermissionsUserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(id) {
        const user = await this.getUser(id);
        if (user.is_admin) {
            return await (0, getAdminPermissions_1.getAdminPermissions)();
        }
        return await (0, getUserPermissions_1.getUserPermissions)();
    }
    async getUser(id) {
        const user = await this.userRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(id) },
        });
        if (!user) {
            throw new NotFound_1.NotFound('User not found');
        }
        return user;
    }
}
exports.PermissionsUserService = PermissionsUserService;
