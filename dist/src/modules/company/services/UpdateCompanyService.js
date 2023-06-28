"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCompanyService = void 0;
const BadRequest_1 = require("@/errors/BadRequest");
const mongodb_1 = require("mongodb");
class UpdateCompanyService {
    companyRepository;
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async execute({ name, company_id, updated_at, }) {
        if (!name || !name.trim() || typeof name !== 'string') {
            throw new BadRequest_1.BadRequest('Name is required');
        }
        if (!updated_at || !(updated_at instanceof Date)) {
            updated_at = new Date();
        }
        await this.checkIfCompanyExists(name);
        const company = await this.findCompany(company_id);
        this.companyRepository.merge(company, { name, updated_at });
        await this.companyRepository.save(company);
        return company;
    }
    async checkIfCompanyExists(name) {
        const company = await this.companyRepository.findOne({
            where: { name },
        });
        if (company) {
            throw new BadRequest_1.BadRequest('Company already exists');
        }
    }
    async findCompany(company_id) {
        const company = await this.companyRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(company_id) },
        });
        if (!company) {
            throw new Error('Company not found');
        }
        return company;
    }
}
exports.UpdateCompanyService = UpdateCompanyService;
