import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { getDataSource } from '@/connection/AppDataSource';
import { Unit } from '@unit/infra/schema/Unit';

export class DeleteUnitService {
  readonly unitRepository: Repository<Unit>;
  constructor(unitRepository: Repository<Unit>) {
    this.unitRepository = unitRepository;
  }
  async execute(company: string, unit: string): Promise<void> {
    await this.removeActivesInUnit(company, unit);
    await this.unitRepository.delete({ _id: new ObjectId(unit) });
  }
  private async removeActivesInUnit(
    company: string,
    unit: string
  ): Promise<void> {
    const activeRepository = await getDataSource().then(dataSource =>
      dataSource.getMongoRepository(Unit)
    );
    const actives = await activeRepository.find({
      where: { company_id: company, unit_id: unit },
    });
    if (!actives) return;

    actives.forEach(async active => {
      await activeRepository.delete({ _id: new ObjectId(active._id) });
    });
  }
}
