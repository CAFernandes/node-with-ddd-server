import { UnitsController } from '@unit/controller/UnitsController';
import { Router } from 'express';

export class UnitRouter {
  public router: Router;
  constructor() {
    this.router = Router();
  }
  routes(): Router {
    this.router.get('/', UnitsController.index);
    this.router.get('/:id', UnitsController.show);
    this.router.post('/', UnitsController.create);
    this.router.put('/:id', UnitsController.update);
    this.router.delete('/:id', UnitsController.delete);
    return this.router;
  }
}
