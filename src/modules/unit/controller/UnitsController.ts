import { getDataSource } from '@/connection/AppDataSource';
import { UnauthorizedError } from '@/errors/UnauthorizedError';
import { Unit } from '@unit/infra/schema/Unit';
import { CreateUnitService } from '@unit/services/CreateUnitService';
import { DeleteUnitService } from '@unit/services/DeleteUnitServices';
import { ListUnitsService } from '@unit/services/ListUnitServices';
import { UpdateUnitService } from '@unit/services/UpdateUnitService';
import { AuthenticateRequest } from '@user/infra/types/AuthenticateRequest';
import { NextFunction, Request, Response } from 'express';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { logger } from '@/utils/logger';

export class UnitsController {
  private static async getRepository(): Promise<Repository<Unit>> {
    return await getDataSource().then(dataSource =>
      dataSource.getMongoRepository(Unit)
    );
  }
  static async create(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Invalid token');
      }
      const createUnitService = new CreateUnitService(
        await UnitsController.getRepository()
      );
      const unit = await createUnitService.execute({
        ...req.body,
        company_id: req?.user?.company,
      });
      return res.status(201).json(unit);
    } catch (error) {
      next(error);
    }
  }
  static async index(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Invalid token');
      }
      logger.info(req.user);
      const listUnitsService = new ListUnitsService(
        await UnitsController.getRepository()
      );
      const units = await listUnitsService.execute(
        req?.user?.company || (req.query.company as string)
      );
      return res.status(200).json(units);
    } catch (error) {
      next(error);
    }
  }
  static async show(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Invalid token');
      }
      const unitRepository = await UnitsController.getRepository();
      const unit = await unitRepository.findOne({
        where: {
          _id: new ObjectId(req.params.id),
          company_id: req?.user?.company || '',
        },
      });
      res.status(200).json(unit);
    } catch (error) {
      next(error);
    }
  }
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateUnitService = new UpdateUnitService(
        await UnitsController.getRepository()
      );
      const unit = await updateUnitService.execute({
        unit_id: id,
        ...req.body,
      });
      return res.status(200).json(unit);
    } catch (error) {
      next(error);
    }
  }
  static async delete(
    req: AuthenticateRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Invalid token');
      }
      const unitRepository = await UnitsController.getRepository();
      const deleteUnitService = new DeleteUnitService(unitRepository);
      await deleteUnitService.execute(req?.user?.company || '', req.params.id);
      return res.status(204).json();
    } catch (error) {
      next(error);
    }
  }
}
