"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUnitService = void 0;
const mongodb_1 = require("mongodb");
const AppDataSource_1 = require("@/connection/AppDataSource");
const Unit_1 = require("@unit/infra/schema/Unit");
class DeleteUnitService {
    unitRepository;
    constructor(unitRepository) {
        this.unitRepository = unitRepository;
    }
    async execute(company, unit) {
        await this.removeActivesInUnit(company, unit);
        await this.unitRepository.delete({ _id: new mongodb_1.ObjectId(unit) });
    }
    async removeActivesInUnit(company, unit) {
        const activeRepository = await (0, AppDataSource_1.getDataSource)().then(dataSource => dataSource.getMongoRepository(Unit_1.Unit));
        const actives = await activeRepository.find({
            where: { company_id: company, unit_id: unit },
        });
        if (!actives)
            return;
        actives.forEach(async (active) => {
            await activeRepository.delete({ _id: new mongodb_1.ObjectId(active._id) });
        });
    }
}
exports.DeleteUnitService = DeleteUnitService;
