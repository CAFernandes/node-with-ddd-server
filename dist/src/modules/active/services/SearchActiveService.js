"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchActiveService = void 0;
const mongodb_1 = require("mongodb");
class SearchActiveService {
    activeRepository;
    constructor(activeRepository) {
        this.activeRepository = activeRepository;
    }
    async execute(id) {
        const active = await this.activeRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(id) },
        });
        return active;
    }
}
exports.SearchActiveService = SearchActiveService;
