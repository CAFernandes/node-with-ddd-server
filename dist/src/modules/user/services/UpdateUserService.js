"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserService = void 0;
const mongodb_1 = require("mongodb");
const NotFound_1 = require("@/errors/NotFound");
class UpdateUserService {
    acceptedFields = ['name', 'username', 'password'];
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(user) {
        const { id, ...userData } = user;
        if (!id) {
            throw new Error('User id is required');
        }
        const userId = new mongodb_1.ObjectId(id);
        const keys = Object.keys(userData);
        if (keys.length === 0) {
            throw new Error('No data to update');
        }
        const isValidFields = keys.every(key => this.acceptedFields.includes(key));
        if (!isValidFields) {
            throw new Error('Invalid field');
        }
        let updatedUser = await this.userRepository.findOneBy({
            _id: new mongodb_1.ObjectId(userId),
        });
        if (!updatedUser) {
            throw new NotFound_1.NotFound('User not found');
        }
        const updatedFields = {
            ...userData,
            updated_at: new Date(),
        };
        this.userRepository.merge(updatedUser, updatedFields);
        return await this.userRepository.save(updatedUser);
    }
}
exports.UpdateUserService = UpdateUserService;
