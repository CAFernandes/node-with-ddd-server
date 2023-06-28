import { getDataSource } from '@/connection/AppDataSource';
import { UnauthorizedError } from '@/errors/UnauthorizedError';
import { Company } from '@company/infra/schema/Company';
import { CreateCompanyService } from '@company/services/CreateCompanyService';
import { DeleteCompanyService } from '@company/services/DeleteCompanyService';
import { ListCompanyService } from '@company/services/ListCompanyService';
import { SearchCompanyServices } from '@company/services/SearchCompanyServices';
import { UpdateCompanyService } from '@company/services/UpdateCompanyService';
import { AuthenticateRequest } from '@user/infra/types/AuthenticateRequest';
import { NextFunction, Request, Response } from 'express';
import { Repository } from 'typeorm';

export class CompanyController {
  private static async getRepository(): Promise<Repository<Company>> {
    return await getDataSource().then(dataSource =>
      dataSource.getMongoRepository(Company)
    );
  }
  //* GET /companys - Listar todos os companys cadastrados no sistema (apenas para usuários autenticados - ADMIN)
  public static async index(
    request: AuthenticateRequest,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    try {
      const listCompanyService = new ListCompanyService(
        await CompanyController.getRepository()
      );
      return response.json(
        await listCompanyService.execute(
          request?.user?.company || null,
          request?.user?.id || null
        )
      );
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
      const { name }: { name: string } = request.body;
      const created_at = new Date();
      const createCompanyService = new CreateCompanyService(
        await CompanyController.getRepository()
      );
      const company = await createCompanyService.execute({ name, created_at });
      return response.json(company);
    } catch (error) {
      next(error);
    }
  }
  public static async show(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { name } = request.query;
    const searchCompanyService = new SearchCompanyServices(
      await CompanyController.getRepository()
    );
    const companys = await searchCompanyService.execute(name as string);
    return response.json(companys);
  }
  public static async update(
    request: AuthenticateRequest,
    response: Response
  ): Promise<Response> {
    if (!request.user) {
      throw new UnauthorizedError('User not found');
    }
    const { name } = request.body;
    const { id } = request.params;
    const updateCompanyService = new UpdateCompanyService(
      await CompanyController.getRepository()
    );
    const company = await updateCompanyService.execute({
      name,
      company_id: id,
    });
    return response.json(company);
  }
  public static async delete(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { id } = request.params;
    const deleteCompanyService = new DeleteCompanyService(
      await CompanyController.getRepository()
    );
    await deleteCompanyService.execute(id);
    return response.status(204).send();
  }
}
