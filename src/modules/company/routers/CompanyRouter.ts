import { CompanyController } from '@company/controllers/CompanyController';
import { Router } from 'express';

export class CompanyRouter {
  private router: Router;
  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.get('/', CompanyController.index);
    this.router.get('/:id', CompanyController.show);
    this.router.post('/', CompanyController.create);
    this.router.put('/:id', CompanyController.update);
    this.router.delete('/:id', CompanyController.delete);

    return this.router;
  }
}
