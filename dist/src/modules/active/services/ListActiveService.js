"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListActiveService = void 0;
class ListActiveService {
    activeRepository;
    constructor(activeRepository) {
        this.activeRepository = activeRepository;
    }
    async execute(company_id, unit_id) {
        if (unit_id) {
            return await this.executeByUnit(company_id, unit_id);
        }
        return await this.executeByCompany(company_id);
    }
    async executeByUnit(company_id, unit_id) {
        const active = await this.activeRepository.find({
            where: { company_id, unit_id },
        });
        return active;
    }
    async executeByCompany(company_id) {
        const active = await this.activeRepository.find({
            where: { company_id },
        });
        return active;
    }
}
exports.ListActiveService = ListActiveService;
