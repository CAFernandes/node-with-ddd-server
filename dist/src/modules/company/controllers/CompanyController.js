"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyController = void 0;
const AppDataSource_1 = require("@/connection/AppDataSource");
const UnauthorizedError_1 = require("@/errors/UnauthorizedError");
const Company_1 = require("@company/infra/schema/Company");
const CreateCompanyService_1 = require("@company/services/CreateCompanyService");
const DeleteCompanyService_1 = require("@company/services/DeleteCompanyService");
const ListCompanyService_1 = require("@company/services/ListCompanyService");
const SearchCompanyServices_1 = require("@company/services/SearchCompanyServices");
const UpdateCompanyService_1 = require("@company/services/UpdateCompanyService");
class CompanyController {
    static async getRepository() {
        return await (0, AppDataSource_1.getDataSource)().then(dataSource => dataSource.getMongoRepository(Company_1.Company));
    }
    static async index(request, response, next) {
        try {
            const listCompanyService = new ListCompanyService_1.ListCompanyService(await CompanyController.getRepository());
            return response.json(await listCompanyService.execute(request?.user?.company || null, request?.user?.id || null));
        }
        catch (error) {
            next(error);
        }
    }
    static async create(request, response, next) {
        try {
            const { name } = request.body;
            const created_at = new Date();
            const createCompanyService = new CreateCompanyService_1.CreateCompanyService(await CompanyController.getRepository());
            const company = await createCompanyService.execute({ name, created_at });
            return response.json(company);
        }
        catch (error) {
            next(error);
        }
    }
    static async show(request, response) {
        const { name } = request.query;
        const searchCompanyService = new SearchCompanyServices_1.SearchCompanyServices(await CompanyController.getRepository());
        const companys = await searchCompanyService.execute(name);
        return response.json(companys);
    }
    static async update(request, response) {
        if (!request.user) {
            throw new UnauthorizedError_1.UnauthorizedError('User not found');
        }
        const { name } = request.body;
        const { id } = request.params;
        const updateCompanyService = new UpdateCompanyService_1.UpdateCompanyService(await CompanyController.getRepository());
        const company = await updateCompanyService.execute({
            name,
            company_id: id,
        });
        return response.json(company);
    }
    static async delete(request, response) {
        const { id } = request.params;
        const deleteCompanyService = new DeleteCompanyService_1.DeleteCompanyService(await CompanyController.getRepository());
        await deleteCompanyService.execute(id);
        return response.status(204).send();
    }
}
exports.CompanyController = CompanyController;
