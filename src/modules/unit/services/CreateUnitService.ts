import { getDataSource } from '@/connection/AppDataSource';
import { BadRequest } from '@/errors/BadRequest';
import { UnauthorizedError } from '@/errors/UnauthorizedError';
import { Company } from '@company/infra/schema/Company';
import { ICreateUnitDTO } from '@unit/infra/dtos/ICreateUnitDTO';
import { Unit } from '@unit/infra/schema/Unit';
import { ObjectId } from 'mongodb';
import { InsertResult, Repository } from 'typeorm';

export class CreateUnitService {
  constructor(private readonly unitRepository: Repository<Unit>) {}
  async execute({
    name,
    company_id,
    created_at,
  }: ICreateUnitDTO): Promise<InsertResult> {
    if (!name) throw new BadRequest('Name is required');
    if (!company_id) throw new BadRequest('Company is required');
    if (!created_at) created_at = new Date();

    if (!(await this.checkIfCompanyExists(company_id))) {
      throw new BadRequest('Company does not exists');
    }
    if (await this.checkIfUnitExists(name, company_id)) {
      throw new UnauthorizedError('Unit already exists');
    }

    return this.unitRepository.manager.insert(Unit, {
      name,
      company_id,
      created_at,
    });
  }
  private async checkIfCompanyExists(company_id: string): Promise<boolean> {
    const companiesRepository = await getDataSource().then(dataSource =>
      dataSource.getMongoRepository(Company)
    );
    const searchedCompany = await companiesRepository.findOne({
      where: {
        _id: new ObjectId(company_id),
      },
    });
    if (searchedCompany) {
      return true;
    }
    return false;
  }
  private async checkIfUnitExists(
    name: string,
    company_id: string
  ): Promise<boolean> {
    const searchedUnit = await this.unitRepository.findOne({
      where: {
        name: name,
        company_id: company_id,
      },
    });
    if (searchedUnit) {
      return true;
    }
    return false;
  }
}
