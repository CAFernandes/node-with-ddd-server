import { getDataSource } from '@/connection/AppDataSource';
import { logger } from '@/utils/logger';
import { Company } from '@company/infra/schema/Company';
import { ListUserDTO } from '@user/infra/dtos/ListUsersDTO';
import { User } from '@user/infra/schema/User';
import { ObjectId } from 'mongodb';
import { Repository } from 'typeorm';

export class ListUserService {
  constructor(readonly userRepository: Repository<User>) {}
  async execute(company_id: string): Promise<ListUserDTO[]> {
    let users: User[] = [];
    if (company_id) {
      users = await this.getUserByCompany(company_id);
    } else {
      users = await this.getListUsers();
    }

    const usersCleared = await Promise.all(
      users.map(async user => {
        user as ListUserDTO;
        delete user.password;
        delete user.refresh_token;
        delete user.is_admin;
        user.relation = await this.getInfoCompany(user?.company_id || '');
        delete user.company_id;
        return user;
      })
    );
    return usersCleared;
  }
  private async getUserByCompany(company_id: string): Promise<User[]> {
    if (!company_id) return [];
    const users = await this.userRepository.find({
      where: { company_id: company_id },
    });
    return users;
  }
  private async getListUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
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
