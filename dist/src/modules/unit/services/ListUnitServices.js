"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListUnitsService = void 0;
const AppDataSource_1 = require("@/connection/AppDataSource");
const BadRequest_1 = require("@/errors/BadRequest");
const NotFound_1 = require("@/errors/NotFound");
const Active_1 = require("@active/infra/schema/Active");
class ListUnitsService {
    unitRepository;
    constructor(unitRepository) {
        this.unitRepository = unitRepository;
    }
    async execute(company_id) {
        if (!company_id) {
            throw new BadRequest_1.BadRequest('Company id is required');
        }
        const units = await this.getUnits(company_id);
        const relatedCompanies = await Promise.all(units.map(async (unit) => {
            const total_actives = await this.getTotalActives(unit._id.toString(), company_id);
            return {
                ...unit,
                total_actives,
            };
        }));
        return relatedCompanies;
    }
    async getUnits(company_id) {
        const unit = await this.unitRepository.find({
            where: { company_id: company_id },
        });
        console.log(unit);
        if (!unit) {
            throw new NotFound_1.NotFound('Units not found');
        }
        return unit;
    }
    async getTotalActives(unit_id, company_id) {
        const activesRepository = await (0, AppDataSource_1.getDataSource)().then(dataSource => dataSource.getMongoRepository(Active_1.Active));
        const actives = await activesRepository.find({
            where: { company_id: company_id, unit_id: unit_id },
        });
        if (!actives) {
            return 0;
        }
        return actives.length;
    }
}
exports.ListUnitsService = ListUnitsService;
