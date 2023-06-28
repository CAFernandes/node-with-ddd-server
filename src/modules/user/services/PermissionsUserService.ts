import { NotFound } from '@/errors/NotFound';
import { getAdminPermissions } from '@user/infra/middleware/getAdminPermissions';
import { getUserPermissions } from '@user/infra/middleware/getUserPermissions';
import { User } from '@user/infra/schema/User';
import { Permissions } from '@user/infra/types/Permissions';
import { ObjectId } from 'mongodb';
import { Repository } from 'typeorm';

export class PermissionsUserService {
  constructor(private readonly userRepository: Repository<User>) {} //correto seria ter uma tabela para as permissões e uma tabela para os usuários e uma tabela para as permissões dos usuários
  async execute(id: string): Promise<Permissions> {
    const user = await this.getUser(id);

    if (user.is_admin) {
      return await getAdminPermissions();
    }

    return await getUserPermissions();
  }
  private async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
    if (!user) {
      throw new NotFound('User not found');
    }
    return user;
  }
}
