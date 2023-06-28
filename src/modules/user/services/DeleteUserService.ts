import { User } from '@user/infra/schema/User';

import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';

export class DeleteUserService {
  readonly userRepository: Repository<User>;
  constructor(userRepository: Repository<User>) {
    this.userRepository = userRepository;
  }
  async execute(user: string): Promise<void> {
    await this.userRepository.delete({ _id: new ObjectId(user) });
  }
}
