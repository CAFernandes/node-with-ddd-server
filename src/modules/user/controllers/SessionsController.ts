import { Request, Response, NextFunction } from 'express';
import { Repository } from 'typeorm';

import { getDataSource } from '@/connection/AppDataSource';
import { User } from '@user/infra/schema/User';
import { RefreshJwtToken } from '@user/services/RefreshJwtService';
import { CreateSessionService } from '@user/services/CreateSessionService';
import { LogoutSessionService } from '@user/services/LogoutSessionService';
import { PermissionsUserService } from '@user/services/PermissionsUserService';
import { AuthenticateRequest } from '@user/infra/types/AuthenticateRequest';
import { UnauthorizedError } from '@/errors/UnauthorizedError';

export class SessionController {
  private static async getRepository(): Promise<Repository<User>> {
    return await getDataSource().then(dataSource =>
      dataSource.getMongoRepository(User)
    );
  }
  public static async index(
    request: AuthenticateRequest,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    try {
      if (!request.user) {
        throw new UnauthorizedError('Invalid token');
      }
      const { id } = request.user;

      const permissionUserService = new PermissionsUserService(
        await SessionController.getRepository()
      );
      return response.json(await permissionUserService.execute(id));
    } catch (error) {
      next(error);
    }
  }
  public static async create(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    try {
      const { username, password } = request.body;
      const authenticateService = new CreateSessionService(
        await SessionController.getRepository()
      );

      await authenticateService.execute({
        username,
        password,
      });
      return response.json(
        await authenticateService.execute({
          username,
          password,
        })
      );
    } catch (error) {
      next(error);
    }
  }
  public static async refresh(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    try {
      console.log(request.body);
      const { refreshToken } = request.body;
      const refreshService = new RefreshJwtToken(
        await SessionController.getRepository()
      );
      const accessToken = await refreshService.execute(refreshToken);
      console.log(accessToken);
      return response.json({ accessToken });
    } catch (error) {
      next(error);
    }
  }
  public static async delete(
    request: AuthenticateRequest,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    try {
      if (!request.user) {
        throw new UnauthorizedError('Invalid token');
      }
      const { id } = request.user;
      const logoutService = new LogoutSessionService(
        await SessionController.getRepository()
      );
      await logoutService.execute(id);
      return response.json({ message: 'Logout successfully' });
    } catch (error) {
      next(error);
    }
  }
}
