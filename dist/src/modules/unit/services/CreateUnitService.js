"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUnitService = void 0;
const AppDataSource_1 = require("@/connection/AppDataSource");
const BadRequest_1 = require("@/errors/BadRequest");
const UnauthorizedError_1 = require("@/errors/UnauthorizedError");
const Company_1 = require("@company/infra/schema/Company");
const Unit_1 = require("@unit/infra/schema/Unit");
const mongodb_1 = require("mongodb");
class CreateUnitService {
    unitRepository;
    constructor(unitRepository) {
        this.unitRepository = unitRepository;
    }
    async execute({ name, company_id, created_at, }) {
        if (!name)
            throw new BadRequest_1.BadRequest('Name is required');
        if (!company_id)
            throw new BadRequest_1.BadRequest('Company is required');
        if (!created_at)
            created_at = new Date();
        if (!(await this.checkIfCompanyExists(company_id))) {
            throw new BadRequest_1.BadRequest('Company does not exists');
        }
        if (await this.checkIfUnitExists(name, company_id)) {
            throw new UnauthorizedError_1.UnauthorizedError('Unit already exists');
        }
        return this.unitRepository.manager.insert(Unit_1.Unit, {
            name,
            company_id,
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
        if (searchedCompany) {
            return true;
        }
        return false;
    }
    async checkIfUnitExists(name, company_id) {
        const searchedUnit = await this.unitRepository.findOne({
            where: {
                name: name,
                company_id: company_id,
            },
        });
        if (searchedUnit) {
            return true;
        }
        return false;
    }
}
exports.CreateUnitService = CreateUnitService;
