import { NextFunction, Request, Response } from 'express';
import { Repository } from 'typeorm';
import { getDataSource } from '@/connection/AppDataSource';
import { UnauthorizedError } from '@/errors/UnauthorizedError';
import { Active } from '@active/infra/schema/Active';
import { CreateActiveService } from '@active/services/CreateActiveService';
import { DeleteActiveService } from '@active/services/DeleteActiveService';
import { ListActiveService } from '@active/services/ListActiveService';
import { SearchActiveService } from '@active/services/SearchActiveService';
import { UpdateActiveService } from '@active/services/UpdateActiveService';
import { AuthenticateRequest } from '@user/infra/types/AuthenticateRequest';
import { logger } from '@/utils/logger';

export class ActiveController {
  private static async getRepository(): Promise<Repository<Active>> {
    return await getDataSource().then(dataSource =>
      dataSource.getMongoRepository(Active)
    );
  }
  static async index(
    request: AuthenticateRequest,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    try {
      if (!request.user) {
        throw new UnauthorizedError('Invalid token');
      }
      const listActiveService = new ListActiveService(
        await ActiveController.getRepository()
      );
      const { unit } = request.params;
      return response.json(
        await listActiveService.execute(request?.user?.company, unit)
      );
    } catch (error) {
      next(error);
    }
  }
  static async show(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    try {
      const { id } = request.params;
      const searchActiveService = new SearchActiveService(
        await ActiveController.getRepository()
      );

      return response.json(await searchActiveService.execute(id));
    } catch (error) {
      next(error);
    }
  }
  static async create(
    request: AuthenticateRequest,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    try {
      if (!request.user) {
        throw new UnauthorizedError('Invalid token');
      }
      const createActiveService = new CreateActiveService(
        await ActiveController.getRepository()
      );
      const active = await createActiveService.execute({
        ...request.body,
        company_id: request?.user?.company || '',
      });
      return response.json({
        status: 'success',
        message: 'Ativo cadastrado com sucesso',
        id: active.raw.insertedId,
      });
    } catch (error) {
      next(error);
    }
  }
  static async update(
    request: AuthenticateRequest,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    try {
      const { id } = request.params;
      logger.info(`Update active ${id}`);
      const activeRepository = await ActiveController.getRepository();
      const updateActiveService = new UpdateActiveService(activeRepository);
      const active = await updateActiveService.execute({
        ...request.body,
        id,
      });

      return response.json(active);
    } catch (error) {
      next(error);
    }
  }
  static async delete(
    request: AuthenticateRequest,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    try {
      const { id } = request.params;
      const deleteActiveService = new DeleteActiveService(
        await ActiveController.getRepository()
      );
      await deleteActiveService.execute(id);
      return response.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
