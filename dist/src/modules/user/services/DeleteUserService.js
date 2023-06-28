"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserService = void 0;
const mongodb_1 = require("mongodb");
class DeleteUserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(user) {
        await this.userRepository.delete({ _id: new mongodb_1.ObjectId(user) });
    }
}
exports.DeleteUserService = DeleteUserService;
