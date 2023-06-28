"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUnitService = void 0;
const BadRequest_1 = require("@/errors/BadRequest");
const mongodb_1 = require("mongodb");
class UpdateUnitService {
    unitRepository;
    constructor(unitRepository) {
        this.unitRepository = unitRepository;
    }
    async execute({ name, unit_id, updated_at }) {
        if (!updated_at)
            updated_at = new Date();
        if (!name)
            throw new BadRequest_1.BadRequest('Name is required');
        if (!unit_id)
            throw new BadRequest_1.BadRequest('Unit is required');
        const unit = await this.findUnit(unit_id);
        this.unitRepository.merge(unit, { name, updated_at });
        return await this.unitRepository.save(unit);
    }
    async findUnit(unit_id) {
        const unit = await this.unitRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(unit_id) },
        });
        if (!unit) {
            throw new BadRequest_1.BadRequest('Unit not found');
        }
        return unit;
    }
}
exports.UpdateUnitService = UpdateUnitService;
