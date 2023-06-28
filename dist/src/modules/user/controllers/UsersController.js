"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const User_1 = require("@user/infra/schema/User");
const AppDataSource_1 = require("@/connection/AppDataSource");
const CreateUserService_1 = require("@user/services/CreateUserService");
const UpdateUserService_1 = require("@user/services/UpdateUserService");
const hashPassword_1 = require("@user/infra/middleware/hashPassword");
const DeleteUserService_1 = require("@user/services/DeleteUserService");
const SearchUserService_1 = require("@user/services/SearchUserService");
const ListUserService_1 = require("@user/services/ListUserService");
class UsersController {
    static async getRepository() {
        return await (0, AppDataSource_1.getDataSource)().then(dataSource => dataSource.getMongoRepository(User_1.User));
    }
    static async index(request, response, next) {
        try {
            if (!request.user)
                throw new Error('User not found');
            const company_id = request.user.company;
            const listUserService = new ListUserService_1.ListUserService(await UsersController.getRepository());
            return response.json(await listUserService.execute(company_id));
        }
        catch (error) {
            next(error);
        }
    }
    static async create(request, response, next) {
        try {
            const { name, company, username, password } = request.body;
            const userRepository = await UsersController.getRepository();
            const createUserService = new CreateUserService_1.CreateUserService(userRepository);
            const user = await createUserService.execute({
                name,
                company_id: company,
                username,
                password: await (0, hashPassword_1.hashPassword)(password),
                created_at: new Date(),
            });
            return response.json(user);
        }
        catch (error) {
            next(error);
        }
    }
    static async show(request, response, next) {
        try {
            const { id } = request.params;
            const searchCompanyService = new SearchUserService_1.SearchUserService(await UsersController.getRepository());
            return response.json(searchCompanyService.execute(id));
        }
        catch (error) {
            next(error);
        }
    }
    static async update(request, response, next) {
        try {
            const { id } = request.params;
            const usersRepository = await UsersController.getRepository();
            const updateUserService = new UpdateUserService_1.UpdateUserService(usersRepository);
            const user = await updateUserService.execute({ ...request.body, id });
            return response.json(user);
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(request, response, next) {
        try {
            const { id } = request.params;
            const usersRepository = await UsersController.getRepository();
            const deleteUserService = new DeleteUserService_1.DeleteUserService(usersRepository);
            await deleteUserService.execute(id);
            return response.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
    static async me(request, response, next) {
        try {
            if (!request.user)
                throw new Error('User not found');
            const { user } = request;
            const userRepository = await UsersController.getRepository();
            const searchUserService = new SearchUserService_1.SearchUserService(userRepository);
            return response.json(await searchUserService.execute(user.id));
        }
        catch (error) {
            next(error);
        }
    }
    static async resetPassword(request, response, next) {
        try {
            if (!request.user)
                throw new Error('User not found');
            const { user } = request;
            const { password } = request.body;
            const userRepository = await UsersController.getRepository();
            const updateUserService = new UpdateUserService_1.UpdateUserService(userRepository);
            const updatedUser = await updateUserService.execute({
                id: user.id,
                password: await (0, hashPassword_1.hashPassword)(password),
            });
            return response.json(updatedUser);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UsersController = UsersController;
