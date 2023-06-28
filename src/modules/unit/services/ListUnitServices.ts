import { getDataSource } from '@/connection/AppDataSource';
import { BadRequest } from '@/errors/BadRequest';
import { NotFound } from '@/errors/NotFound';
import { Unit } from '@unit/infra/schema/Unit';
import { Repository } from 'typeorm';
import { Active } from '@active/infra/schema/Active';

export class ListUnitsService {
  constructor(readonly unitRepository: Repository<Unit>) {}
  async execute(company_id: string | null) {
    if (!company_id) {
      throw new BadRequest('Company id is required');
    }
    const units = await this.getUnits(company_id);
    const relatedCompanies = await Promise.all(
      units.map(async unit => {
        const total_actives = await this.getTotalActives(
          unit._id.toString(),
          company_id
        );
        return {
          ...unit,
          total_actives,
        };
      })
    );

    return relatedCompanies;
  }
  private async getUnits(company_id: string): Promise<Unit[]> {
    const unit = await this.unitRepository.find({
      where: { company_id: company_id },
    });
    console.log(unit);
    if (!unit) {
      throw new NotFound('Units not found');
    }
    return unit;
  }
  private async getTotalActives(
    unit_id: string,
    company_id: string
  ): Promise<number> {
    const activesRepository = await getDataSource().then(dataSource =>
      dataSource.getMongoRepository(Active)
    );
    const actives = await activesRepository.find({
      where: { company_id: company_id, unit_id: unit_id },
    });
    if (!actives) {
      return 0;
    }
    return actives.length;
  }
}
