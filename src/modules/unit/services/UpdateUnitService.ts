import { BadRequest } from '@/errors/BadRequest';
import { IUpdateUnitDTO } from '@unit/infra/dtos/IUpdateUnitDTO';
import { Unit } from '@unit/infra/schema/Unit';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';

export class UpdateUnitService {
  constructor(readonly unitRepository: Repository<Unit>) {}
  async execute({ name, unit_id, updated_at }: IUpdateUnitDTO): Promise<Unit> {
    if (!updated_at) updated_at = new Date();
    if (!name) throw new BadRequest('Name is required');
    if (!unit_id) throw new BadRequest('Unit is required');

    const unit = await this.findUnit(unit_id);
    this.unitRepository.merge(unit, { name, updated_at });
    return await this.unitRepository.save(unit);
  }
  private async findUnit(unit_id: string): Promise<Unit> {
    const unit = await this.unitRepository.findOne({
      where: { _id: new ObjectId(unit_id) },
    });
    if (!unit) {
      throw new BadRequest('Unit not found');
    }
    return unit;
  }
}
