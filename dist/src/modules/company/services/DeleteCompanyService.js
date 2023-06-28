"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCompanyService = void 0;
const mongodb_1 = require("mongodb");
const AppDataSource_1 = require("@/connection/AppDataSource");
const Unit_1 = require("@unit/infra/schema/Unit");
const User_1 = require("@user/infra/schema/User");
class DeleteCompanyService {
    companyRepository;
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async execute(company) {
        await this.removeUnitInCompany(company);
        await this.removeUsersInCompany(company);
        await this.companyRepository.delete({ _id: new mongodb_1.ObjectId(company) });
    }
    async removeUnitInCompany(company) {
        const unitRespository = await (0, AppDataSource_1.getDataSource)().then(dataSource => dataSource.getMongoRepository(Unit_1.Unit));
        const units = await unitRespository.find({
            where: { company_id: company },
        });
        if (!units)
            return;
        units.forEach(async (unit) => {
            await this.removeActivesInUnit(company, unit._id.toString());
            await unitRespository.delete({ _id: new mongodb_1.ObjectId(unit._id) });
        });
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
    async removeUsersInCompany(company) {
        const userRepository = await (0, AppDataSource_1.getDataSource)().then(dataSource => dataSource.getMongoRepository(User_1.User));
        const users = await userRepository.find({
            where: { company_id: company },
        });
        if (!users)
            return;
        users.forEach(async (user) => {
            await userRepository.delete({ _id: new mongodb_1.ObjectId(user._id) });
        });
    }
}
exports.DeleteCompanyService = DeleteCompanyService;
