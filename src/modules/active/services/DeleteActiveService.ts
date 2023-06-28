import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Active } from '@active/infra/schema/Active';

export class DeleteActiveService {
  readonly activeRepository: Repository<Active>;
  constructor(activeRepository: Repository<Active>) {
    this.activeRepository = activeRepository;
  }
  async execute(active: string): Promise<void> {
    await this.activeRepository.delete({ _id: new ObjectId(active) });
  }
}
