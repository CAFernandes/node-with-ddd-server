import { User } from '@user/infra/schema/User';
import { ObjectId } from 'mongodb';
import { Repository } from 'typeorm';

export class SearchUserService {
  constructor(readonly userRepository: Repository<User>) {}
  async execute(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
    return user;
  }
}
