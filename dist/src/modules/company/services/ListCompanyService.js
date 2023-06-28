"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCompanyService = void 0;
const AppDataSource_1 = require("@/connection/AppDataSource");
const BadRequest_1 = require("@/errors/BadRequest");
const NotFound_1 = require("@/errors/NotFound");
const Unit_1 = require("@unit/infra/schema/Unit");
const User_1 = require("@user/infra/schema/User");
const mongodb_1 = require("mongodb");
const Active_1 = require("@active/infra/schema/Active");
class ListCompanyService {
    companyRepository;
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async execute(company_id, user_id) {
        if (!user_id)
            throw new BadRequest_1.BadRequest('Token not found');
        const companies = company_id
            ? await this.getCompanyByid(company_id)
            : await this.getCompany(user_id);
        const relatedCompanies = await Promise.all(companies.map(async (company) => {
            const total_units = await this.getTotalUnits(company._id.toString());
            const total_actives = await this.getTotalActives(company._id.toString());
            return {
                ...company,
                total_units,
                total_actives,
            };
        }));
        return relatedCompanies;
    }
    async getCompanyByid(company_id) {
        const company = await this.companyRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(company_id) },
        });
        if (!company) {
            throw new NotFound_1.NotFound('Company not found');
        }
        return [company];
    }
    async getCompany(user_id) {
        const userRepository = await (0, AppDataSource_1.getDataSource)().then(dataSource => dataSource.getMongoRepository(User_1.User));
        const user = await userRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(user_id) },
        });
        if (!user) {
            throw new BadRequest_1.BadRequest('User not found');
        }
        if (user.company_id) {
            return await this.getCompanyByid(user.company_id);
        }
        if (!user.is_admin) {
            throw new BadRequest_1.BadRequest('User is not admin');
        }
        const company = await this.companyRepository.find();
        return company;
    }
    async getTotalUnits(company_id) {
        const unitsRepository = await (0, AppDataSource_1.getDataSource)().then(dataSource => dataSource.getMongoRepository(Unit_1.Unit));
        const units = await unitsRepository.find({
            where: { company_id: new mongodb_1.ObjectId(company_id) },
        });
        if (!units) {
            return 0;
        }
        return units.length;
    }
    async getTotalActives(company_id) {
        const activesRepository = await (0, AppDataSource_1.getDataSource)().then(dataSource => dataSource.getMongoRepository(Active_1.Active));
        const actives = await activesRepository.find({
            where: { company_id: new mongodb_1.ObjectId(company_id) },
        });
        if (!actives) {
            return 0;
        }
        return actives.length;
    }
}
exports.ListCompanyService = ListCompanyService;
