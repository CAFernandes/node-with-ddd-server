import { logger } from '@/utils/logger';
import { Active } from '@active/infra/schema/Active';
import { Repository } from 'typeorm';

export class ListActiveService {
  constructor(readonly activeRepository: Repository<Active>) {}
  async execute(company_id: string, unit_id: string): Promise<Active[]> {
    if (unit_id) {
      return await this.executeByUnit(company_id, unit_id);
    }
    return await this.executeByCompany(company_id);
  }

  async executeByUnit(company_id: string, unit_id: string): Promise<Active[]> {
    const active = await this.activeRepository.find({
      where: { company_id, unit_id },
    });
    return active;
  }
  async executeByCompany(company_id: string): Promise<Active[]> {
    const active = await this.activeRepository.find({
      where: { company_id },
    });
    return active;
  }
}
