"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitsController = void 0;
const AppDataSource_1 = require("@/connection/AppDataSource");
const UnauthorizedError_1 = require("@/errors/UnauthorizedError");
const Unit_1 = require("@unit/infra/schema/Unit");
const CreateUnitService_1 = require("@unit/services/CreateUnitService");
const DeleteUnitServices_1 = require("@unit/services/DeleteUnitServices");
const ListUnitServices_1 = require("@unit/services/ListUnitServices");
const UpdateUnitService_1 = require("@unit/services/UpdateUnitService");
const mongodb_1 = require("mongodb");
const logger_1 = require("@/utils/logger");
class UnitsController {
    static async getRepository() {
        return await (0, AppDataSource_1.getDataSource)().then(dataSource => dataSource.getMongoRepository(Unit_1.Unit));
    }
    static async create(req, res, next) {
        try {
            if (!req.user) {
                throw new UnauthorizedError_1.UnauthorizedError('Invalid token');
            }
            const createUnitService = new CreateUnitService_1.CreateUnitService(await UnitsController.getRepository());
            const unit = await createUnitService.execute({
                ...req.body,
                company_id: req?.user?.company,
            });
            return res.status(201).json(unit);
        }
        catch (error) {
            next(error);
        }
    }
    static async index(req, res, next) {
        try {
            if (!req.user) {
                throw new UnauthorizedError_1.UnauthorizedError('Invalid token');
            }
            logger_1.logger.info(req.user);
            const listUnitsService = new ListUnitServices_1.ListUnitsService(await UnitsController.getRepository());
            const units = await listUnitsService.execute(req?.user?.company || req.query.company);
            return res.status(200).json(units);
        }
        catch (error) {
            next(error);
        }
    }
    static async show(req, res, next) {
        try {
            if (!req.user) {
                throw new UnauthorizedError_1.UnauthorizedError('Invalid token');
            }
            const unitRepository = await UnitsController.getRepository();
            const unit = await unitRepository.findOne({
                where: {
                    _id: new mongodb_1.ObjectId(req.params.id),
                    company_id: req?.user?.company || '',
                },
            });
            res.status(200).json(unit);
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const updateUnitService = new UpdateUnitService_1.UpdateUnitService(await UnitsController.getRepository());
            const unit = await updateUnitService.execute({
                unit_id: id,
                ...req.body,
            });
            return res.status(200).json(unit);
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            if (!req.user) {
                throw new UnauthorizedError_1.UnauthorizedError('Invalid token');
            }
            const unitRepository = await UnitsController.getRepository();
            const deleteUnitService = new DeleteUnitServices_1.DeleteUnitService(unitRepository);
            await deleteUnitService.execute(req?.user?.company || '', req.params.id);
            return res.status(204).json();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UnitsController = UnitsController;
