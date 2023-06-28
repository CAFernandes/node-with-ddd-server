import { ActiveController } from '@active/controller/ActiveController';
import { Router } from 'express';

export class ActiveRouter {
  router: Router;
  constructor() {
    this.router = Router();
  }
  routes() {
    this.router.get('/', ActiveController.index);
    this.router.get('/:unit', ActiveController.index);
    this.router.get('/:unit/:id', ActiveController.show);
    this.router.post('/', ActiveController.create);
    this.router.put('/:id', ActiveController.update);
    this.router.delete('/:id', ActiveController.delete);
    return this.router;
  }
}
