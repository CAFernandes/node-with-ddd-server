import { Router } from 'express';
import { UsersController } from '@user/controllers/UsersController';
import { logger } from '@/utils/logger';
export class UserRouter {
  private router: Router;
  constructor() {
    this.router = Router();
  }
  routes() {
    logger.info('UserRouter.routes() - Configuring routes');
    this.router.get('/', UsersController.index);
    this.router.get('/me', UsersController.me);
    this.router.put('/reset-password', UsersController.resetPassword);
    this.router.post('/', UsersController.create);
    this.router.get('/:id', UsersController.show);
    this.router.put('/:id', UsersController.update);
    this.router.delete('/:id', UsersController.delete);

    return this.router;
  }
}
