"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserService = void 0;
const mongodb_1 = require("mongodb");
const User_1 = require("@user/infra/schema/User");
const BadRequest_1 = require("@/errors/BadRequest");
const Company_1 = require("@company/infra/schema/Company");
const AppDataSource_1 = require("@/connection/AppDataSource");
class CreateUserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute({ name, company_id, username, password, created_at, }) {
        if (!name)
            throw new BadRequest_1.BadRequest('Name is required');
        if (!company_id)
            throw new BadRequest_1.BadRequest('Company is required');
        if (!username)
            throw new BadRequest_1.BadRequest('Username is required');
        if (!password)
            throw new BadRequest_1.BadRequest('Password is required');
        if (!created_at)
            throw new BadRequest_1.BadRequest('Created_at is required');
        await this.checkIfCompanyExists(company_id);
        await this.checkIfUsernameExists(username, company_id);
        return this.userRepository.manager.insert(User_1.User, {
            name,
            company_id,
            is_admin: false,
            username,
            password,
            created_at,
        });
    }
    async checkIfCompanyExists(company_id) {
        const companiesRepository = await (0, AppDataSource_1.getDataSource)().then(dataSource => dataSource.getMongoRepository(Company_1.Company));
        const searchedCompany = await companiesRepository.findOne({
            where: {
                _id: new mongodb_1.ObjectId(company_id),
            },
        });
        if (!searchedCompany) {
            throw new BadRequest_1.BadRequest('Company does not exists');
        }
    }
    async checkIfUsernameExists(username, company_id) {
        const searchedUser = await this.userRepository.findOne({
            where: {
                username: username,
                company_id: company_id,
            },
        });
        if (searchedUser) {
            throw new BadRequest_1.BadRequest('Username already exists');
        }
    }
}
exports.CreateUserService = CreateUserService;
