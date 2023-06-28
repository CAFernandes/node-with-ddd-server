import { ObjectId } from 'mongodb';
import { Repository } from 'typeorm';

import { UnauthorizedError } from '@/errors/UnauthorizedError';
import { BadRequest } from '@/errors/BadRequest';

import { User } from '@user/infra/schema/User';
import { comparePasswords } from '@user/infra/middleware/comparePasswords';
import { AuthenticateUserDTO } from '@user/infra/dtos/AuthenticateDTO';
import { getAdminPermissions } from '@user/infra/middleware/getAdminPermissions';
import { getUserPermissions } from '@user/infra/middleware/getUserPermissions';
import { Company } from '@company/infra/schema/Company';
import { getDataSource } from '@/connection/AppDataSource';
import { createAccessToken } from '@user/infra/middleware/createAccessToken';
import { createRefreshToken } from '@user/infra/middleware/createRefereshToken';

export class CreateSessionService {
  constructor(readonly userRepository: Repository<User>) {}
  async execute({ username, password }: AuthenticateUserDTO) {
    if (!username || !password) {
      throw new BadRequest('Credenciais inválidas');
    }

    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedError('Credenciais inválidas');
    }
    if (!user.password) {
      throw new UnauthorizedError('Credenciais inválidas');
    }
    if (!(await comparePasswords(password, user.password))) {
      throw new UnauthorizedError('Credenciais inválidas');
    }
    const accessToken = await createAccessToken(user);
    const refreshToken = await createRefreshToken(user);

    user.refresh_token = refreshToken;
    await this.userRepository.save(user);

    const permissions = user.is_admin
      ? await getAdminPermissions()
      : await getUserPermissions();

    const userResponse = {
      name: user.name,
      username: user.username,
      relation: await this.getInfoCompany(user?.company_id || ''),
    };
    return { accessToken, refreshToken, user: userResponse, permissions };
  }
  private async getInfoCompany(company_id: string): Promise<Company | null> {
    if (!company_id) return null;

    const companyRepository = await getDataSource().then(dataSource =>
      dataSource.getRepository(Company)
    );
    const company = await companyRepository.findOne({
      where: { _id: new ObjectId(company_id) },
    });
    if (!company) return null;
    return company;
  }
}
