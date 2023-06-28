import { ObjectId } from 'mongodb';
import { InsertResult, Repository } from 'typeorm';

import { User } from '@user/infra/schema/User';
import { BadRequest } from '@/errors/BadRequest';
import { Company } from '@company/infra/schema/Company';
import { getDataSource } from '@/connection/AppDataSource';
import { CreateUserDTO } from '@user/infra/dtos/CreateUserDTO';
import { company_user } from '@user/infra/permissions/company_user';

export class CreateUserService {
  readonly userRepository: Repository<User>;
  constructor(userRepository: Repository<User>) {
    this.userRepository = userRepository;
  }
  async execute({
    name,
    company_id,
    username,
    password,
    created_at,
  }: CreateUserDTO): Promise<InsertResult> {
    if (!name) throw new BadRequest('Name is required');
    if (!company_id) throw new BadRequest('Company is required');
    if (!username) throw new BadRequest('Username is required');
    if (!password) throw new BadRequest('Password is required');
    if (!created_at) throw new BadRequest('Created_at is required');

    await this.checkIfCompanyExists(company_id);
    await this.checkIfUsernameExists(username, company_id);
    return this.userRepository.manager.insert(User, {
      name,
      company_id,
      is_admin: false,
      username,
      password,
      created_at,
    });
  }

  private async checkIfCompanyExists(company_id: string): Promise<void> {
    const companiesRepository = await getDataSource().then(dataSource =>
      dataSource.getMongoRepository(Company)
    );
    const searchedCompany = await companiesRepository.findOne({
      where: {
        _id: new ObjectId(company_id),
      },
    });
    if (!searchedCompany) {
      throw new BadRequest('Company does not exists');
    }
  }
  private async checkIfUsernameExists(
    username: string,
    company_id: string
  ): Promise<void> {
    const searchedUser = await this.userRepository.findOne({
      where: {
        username: username,
        company_id: company_id,
      },
    });
    if (searchedUser) {
      throw new BadRequest('Username already exists');
    }
  }
}
