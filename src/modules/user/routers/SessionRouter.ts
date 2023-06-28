import { authenticateToken } from '@middlewares/authenticateToken';
import { SessionController } from '@user/controllers/SessionsController';
import { Router } from 'express';
export class SessionRouter {
  public router: Router;
  constructor() {
    this.router = Router();
  }

  routes() {
    this.router.get('/permissions', authenticateToken, SessionController.index);
    this.router.post('/login', SessionController.create);
    this.router.delete('/logout', authenticateToken, SessionController.delete);
    this.router.post('/refresh-token', SessionController.refresh);
    return this.router;
  }
}
