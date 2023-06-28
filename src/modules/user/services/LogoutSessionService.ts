import { UnauthorizedError } from '@/errors/UnauthorizedError';
import { User } from '@user/infra/schema/User';
import { ObjectId } from 'mongodb';
import { Repository } from 'typeorm';

export class LogoutSessionService {
  constructor(readonly userRepository: Repository<User>) {}
  async execute(id: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
    if (!user) {
      throw new UnauthorizedError('Credenciais inválidas');
    }
    user.refresh_token = null;
    await this.userRepository.save(user);
    return true;
  }
}
