"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveController = void 0;
const AppDataSource_1 = require("@/connection/AppDataSource");
const UnauthorizedError_1 = require("@/errors/UnauthorizedError");
const Active_1 = require("@active/infra/schema/Active");
const CreateActiveService_1 = require("@active/services/CreateActiveService");
const DeleteActiveService_1 = require("@active/services/DeleteActiveService");
const ListActiveService_1 = require("@active/services/ListActiveService");
const SearchActiveService_1 = require("@active/services/SearchActiveService");
const UpdateActiveService_1 = require("@active/services/UpdateActiveService");
const logger_1 = require("@/utils/logger");
class ActiveController {
    static async getRepository() {
        return await (0, AppDataSource_1.getDataSource)().then(dataSource => dataSource.getMongoRepository(Active_1.Active));
    }
    static async index(request, response, next) {
        try {
            if (!request.user) {
                throw new UnauthorizedError_1.UnauthorizedError('Invalid token');
            }
            const listActiveService = new ListActiveService_1.ListActiveService(await ActiveController.getRepository());
            const { unit } = request.params;
            return response.json(await listActiveService.execute(request?.user?.company, unit));
        }
        catch (error) {
            next(error);
        }
    }
    static async show(request, response, next) {
        try {
            const { id } = request.params;
            const searchActiveService = new SearchActiveService_1.SearchActiveService(await ActiveController.getRepository());
            return response.json(await searchActiveService.execute(id));
        }
        catch (error) {
            next(error);
        }
    }
    static async create(request, response, next) {
        try {
            if (!request.user) {
                throw new UnauthorizedError_1.UnauthorizedError('Invalid token');
            }
            const createActiveService = new CreateActiveService_1.CreateActiveService(await ActiveController.getRepository());
            const active = await createActiveService.execute({
                ...request.body,
                company_id: request?.user?.company || '',
            });
            return response.json({
                status: 'success',
                message: 'Ativo cadastrado com sucesso',
                id: active.raw.insertedId,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async update(request, response, next) {
        try {
            const { id } = request.params;
            logger_1.logger.info(`Update active ${id}`);
            const activeRepository = await ActiveController.getRepository();
            const updateActiveService = new UpdateActiveService_1.UpdateActiveService(activeRepository);
            const active = await updateActiveService.execute({
                ...request.body,
                id,
            });
            return response.json(active);
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(request, response, next) {
        try {
            const { id } = request.params;
            const deleteActiveService = new DeleteActiveService_1.DeleteActiveService(await ActiveController.getRepository());
            await deleteActiveService.execute(id);
            return response.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ActiveController = ActiveController;
