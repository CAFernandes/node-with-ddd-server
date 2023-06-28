import { BadRequest } from '@/errors/BadRequest';
import { IUpdateCompanyDTO } from '@company/infra/dtos/IUpdateCompanyDTO';
import { Company } from '@company/infra/schema/Company';
import { ObjectId } from 'mongodb';
import { Repository } from 'typeorm';

export class UpdateCompanyService {
  constructor(readonly companyRepository: Repository<Company>) {}
  async execute({
    name,
    company_id,
    updated_at,
  }: IUpdateCompanyDTO): Promise<Company> {
    if (!name || !name.trim() || typeof name !== 'string') {
      throw new BadRequest('Name is required');
    }
    if (!updated_at || !(updated_at instanceof Date)) {
      updated_at = new Date();
    }
    await this.checkIfCompanyExists(name);
    const company = await this.findCompany(company_id);
    this.companyRepository.merge(company, { name, updated_at });
    await this.companyRepository.save(company);
    return company;
  }
  async checkIfCompanyExists(name: string): Promise<void> {
    const company = await this.companyRepository.findOne({
      where: { name },
    });
    if (company) {
      throw new BadRequest('Company already exists');
    }
  }
  async findCompany(company_id: string): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { _id: new ObjectId(company_id) },
    });
    if (!company) {
      throw new Error('Company not found');
    }
    return company;
  }
}
