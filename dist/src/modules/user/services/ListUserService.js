"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListUserService = void 0;
const AppDataSource_1 = require("@/connection/AppDataSource");
const Company_1 = require("@company/infra/schema/Company");
const mongodb_1 = require("mongodb");
class ListUserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(company_id) {
        let users = [];
        if (company_id) {
            users = await this.getUserByCompany(company_id);
        }
        else {
            users = await this.getListUsers();
        }
        const usersCleared = await Promise.all(users.map(async (user) => {
            user;
            delete user.password;
            delete user.refresh_token;
            delete user.is_admin;
            user.relation = await this.getInfoCompany(user?.company_id || '');
            delete user.company_id;
            return user;
        }));
        return usersCleared;
    }
    async getUserByCompany(company_id) {
        if (!company_id)
            return [];
        const users = await this.userRepository.find({
            where: { company_id: company_id },
        });
        return users;
    }
    async getListUsers() {
        const users = await this.userRepository.find();
        return users;
    }
    async getInfoCompany(company_id) {
        if (!company_id)
            return null;
        const companyRepository = await (0, AppDataSource_1.getDataSource)().then(dataSource => dataSource.getRepository(Company_1.Company));
        const company = await companyRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(company_id) },
        });
        if (!company)
            return null;
        return company;
    }
}
exports.ListUserService = ListUserService;
