"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchCompanyServices = void 0;
class SearchCompanyServices {
    companyRepository;
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async execute(name) {
        const company = await this.companyRepository.find({
            where: { name },
        });
        return company;
    }
}
exports.SearchCompanyServices = SearchCompanyServices;
