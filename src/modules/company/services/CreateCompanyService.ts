import { BadRequest } from '@/errors/BadRequest';
import { ICreateCompanyDTO } from '@company/infra/dtos/ICreateCompanyDTO';
import { Company } from '@company/infra/schema/Company';
import { Repository } from 'typeorm';

export class CreateCompanyService {
  private companyRepository: Repository<Company>;
  constructor(companyRepository: Repository<Company>) {
    this.companyRepository = companyRepository;
  }

  async execute({ name, created_at }: ICreateCompanyDTO) {
    if (!name || !name.trim() || typeof name !== 'string') {
      throw new BadRequest('Name is required');
    }

    const company = await this.companyRepository.findOne({ where: { name } });
    if (company) {
      throw new BadRequest('Company already exists');
    }

    if (!created_at || !(created_at instanceof Date)) {
      created_at = new Date();
    }

    const createdCompany = await this.companyRepository.insert({
      name,
      created_at,
    });
    return createdCompany;
  }
}
