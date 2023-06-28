"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteActiveService = void 0;
const mongodb_1 = require("mongodb");
class DeleteActiveService {
    activeRepository;
    constructor(activeRepository) {
        this.activeRepository = activeRepository;
    }
    async execute(active) {
        await this.activeRepository.delete({ _id: new mongodb_1.ObjectId(active) });
    }
}
exports.DeleteActiveService = DeleteActiveService;
