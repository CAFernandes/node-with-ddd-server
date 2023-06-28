import { Company } from '@company/infra/schema/Company';
import { Repository } from 'typeorm';

export class SearchCompanyServices {
  constructor(readonly companyRepository: Repository<Company>) {}
  async execute(name: string) {
    const company = await this.companyRepository.find({
      where: { name },
    });
    return company;
  }
}
