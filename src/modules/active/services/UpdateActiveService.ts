import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { BadRequest } from '@/errors/BadRequest';
import { IUpdateActiveDTO } from '@active/infra/dtos/IUpdateActiveDTO';
import { Active } from '@active/infra/schema/Active';

export class UpdateActiveService {
  constructor(readonly activeRepository: Repository<Active>) {}

  async execute({
    id,
    status,
    health_level,
    model,
    description,
  }: IUpdateActiveDTO): Promise<Active> {
    const active = await this.findActive(id);
    const updated_at = new Date();

    this.activeRepository.merge(active, {
      model: model || active.model,
      health_level: health_level || active.health_level,
      description: description || active.description,
      status: status || active.status,
      updated_at,
    });

    return await this.activeRepository.save(active);
  }

  private async findActive(id: string): Promise<Active> {
    console.log(id);
    const active = await this.activeRepository.find({
      where: {
        _id: new ObjectId(id),
      },
    });

    if (!active) {
      throw new BadRequest('Active not found');
    }

    return active[0];
  }
}
