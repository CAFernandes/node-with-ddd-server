import { Active } from '@active/infra/schema/Active';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';

export class SearchActiveService {
  constructor(readonly activeRepository: Repository<Active>) {}
  async execute(id: string): Promise<Active | null> {
    const active = await this.activeRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
    return active;
  }
}
