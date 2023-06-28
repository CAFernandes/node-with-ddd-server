"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSessionService = void 0;
const mongodb_1 = require("mongodb");
const UnauthorizedError_1 = require("@/errors/UnauthorizedError");
const BadRequest_1 = require("@/errors/BadRequest");
const comparePasswords_1 = require("@user/infra/middleware/comparePasswords");
const getAdminPermissions_1 = require("@user/infra/middleware/getAdminPermissions");
const getUserPermissions_1 = require("@user/infra/middleware/getUserPermissions");
const Company_1 = require("@company/infra/schema/Company");
const AppDataSource_1 = require("@/connection/AppDataSource");
const createAccessToken_1 = require("@user/infra/middleware/createAccessToken");
const createRefereshToken_1 = require("@user/infra/middleware/createRefereshToken");
class CreateSessionService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute({ username, password }) {
        if (!username || !password) {
            throw new BadRequest_1.BadRequest('Credenciais inválidas');
        }
        const user = await this.userRepository.findOne({ where: { username } });
        if (!user) {
            throw new UnauthorizedError_1.UnauthorizedError('Credenciais inválidas');
        }
        if (!user.password) {
            throw new UnauthorizedError_1.UnauthorizedError('Credenciais inválidas');
        }
        if (!(await (0, comparePasswords_1.comparePasswords)(password, user.password))) {
            throw new UnauthorizedError_1.UnauthorizedError('Credenciais inválidas');
        }
        const accessToken = await (0, createAccessToken_1.createAccessToken)(user);
        const refreshToken = await (0, createRefereshToken_1.createRefreshToken)(user);
        user.refresh_token = refreshToken;
        await this.userRepository.save(user);
        const permissions = user.is_admin
            ? await (0, getAdminPermissions_1.getAdminPermissions)()
            : await (0, getUserPermissions_1.getUserPermissions)();
        const userResponse = {
            name: user.name,
            username: user.username,
            relation: await this.getInfoCompany(user?.company_id || ''),
        };
        return { accessToken, refreshToken, user: userResponse, permissions };
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
exports.CreateSessionService = CreateSessionService;
