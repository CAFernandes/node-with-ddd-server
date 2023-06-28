"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCompanyService = void 0;
const BadRequest_1 = require("@/errors/BadRequest");
class CreateCompanyService {
    companyRepository;
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async execute({ name, created_at }) {
        if (!name || !name.trim() || typeof name !== 'string') {
            throw new BadRequest_1.BadRequest('Name is required');
        }
        const company = await this.companyRepository.findOne({ where: { name } });
        if (company) {
            throw new BadRequest_1.BadRequest('Company already exists');
        }
        if (!created_at || !(created_at instanceof Date)) {
            created_at = new Date();
        }
        const createdCompany = await this.companyRepository.insert({
            name,
            created_at,
        });
        return createdCompany;
    }
}
exports.CreateCompanyService = CreateCompanyService;
