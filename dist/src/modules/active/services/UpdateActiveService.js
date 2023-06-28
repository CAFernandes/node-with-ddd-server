"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateActiveService = void 0;
const mongodb_1 = require("mongodb");
const BadRequest_1 = require("@/errors/BadRequest");
class UpdateActiveService {
    activeRepository;
    constructor(activeRepository) {
        this.activeRepository = activeRepository;
    }
    async execute({ id, status, health_level, model, description, }) {
        const active = await this.findActive(id);
        const updated_at = new Date();
        this.activeRepository.merge(active, {
            model: model || active.model,
            health_level: health_level || active.health_level,
            description: description || active.description,
            status: status || active.status,
            updated_at,
        });
        return await this.activeRepository.save(active);
    }
    async findActive(id) {
        console.log(id);
        const active = await this.activeRepository.find({
            where: {
                _id: new mongodb_1.ObjectId(id),
            },
        });
        if (!active) {
            throw new BadRequest_1.BadRequest('Active not found');
        }
        return active[0];
    }
}
exports.UpdateActiveService = UpdateActiveService;
