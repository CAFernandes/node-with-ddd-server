"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchUserService = void 0;
const mongodb_1 = require("mongodb");
class SearchUserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(id) {
        const user = await this.userRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(id) },
        });
        return user;
    }
}
exports.SearchUserService = SearchUserService;
