"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionController = void 0;
const AppDataSource_1 = require("@/connection/AppDataSource");
const User_1 = require("@user/infra/schema/User");
const RefreshJwtService_1 = require("@user/services/RefreshJwtService");
const CreateSessionService_1 = require("@user/services/CreateSessionService");
const LogoutSessionService_1 = require("@user/services/LogoutSessionService");
const PermissionsUserService_1 = require("@user/services/PermissionsUserService");
const UnauthorizedError_1 = require("@/errors/UnauthorizedError");
class SessionController {
    static async getRepository() {
        return await (0, AppDataSource_1.getDataSource)().then(dataSource => dataSource.getMongoRepository(User_1.User));
    }
    static async index(request, response, next) {
        try {
            if (!request.user) {
                throw new UnauthorizedError_1.UnauthorizedError('Invalid token');
            }
            const { id } = request.user;
            const permissionUserService = new PermissionsUserService_1.PermissionsUserService(await SessionController.getRepository());
            return response.json(await permissionUserService.execute(id));
        }
        catch (error) {
            next(error);
        }
    }
    static async create(request, response, next) {
        try {
            const { username, password } = request.body;
            const authenticateService = new CreateSessionService_1.CreateSessionService(await SessionController.getRepository());
            await authenticateService.execute({
                username,
                password,
            });
            return response.json(await authenticateService.execute({
                username,
                password,
            }));
        }
        catch (error) {
            next(error);
        }
    }
    static async refresh(request, response, next) {
        try {
            console.log(request.body);
            const { refreshToken } = request.body;
            const refreshService = new RefreshJwtService_1.RefreshJwtToken(await SessionController.getRepository());
            const accessToken = await refreshService.execute(refreshToken);
            console.log(accessToken);
            return response.json({ accessToken });
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(request, response, next) {
        try {
            if (!request.user) {
                throw new UnauthorizedError_1.UnauthorizedError('Invalid token');
            }
            const { id } = request.user;
            const logoutService = new LogoutSessionService_1.LogoutSessionService(await SessionController.getRepository());
            await logoutService.execute(id);
            return response.json({ message: 'Logout successfully' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SessionController = SessionController;
