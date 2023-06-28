import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Company } from '@company/infra/schema/Company';
import { getDataSource } from '@/connection/AppDataSource';
import { Unit } from '@unit/infra/schema/Unit';
import { User } from '@user/infra/schema/User';

export class DeleteCompanyService {
  readonly companyRepository: Repository<Company>;
  constructor(companyRepository: Repository<Company>) {
    this.companyRepository = companyRepository;
  }
  async execute(company: string): Promise<void> {
    await this.removeUnitInCompany(company);
    await this.removeUsersInCompany(company);
    await this.companyRepository.delete({ _id: new ObjectId(company) });
  }
  private async removeUnitInCompany(company: string): Promise<void> {
    const unitRespository = await getDataSource().then(dataSource =>
      dataSource.getMongoRepository(Unit)
    );
    const units = await unitRespository.find({
      where: { company_id: company },
    });

    if (!units) return;

    units.forEach(async unit => {
      await this.removeActivesInUnit(company, unit._id.toString());
      await unitRespository.delete({ _id: new ObjectId(unit._id) });
    });
  }
  private async removeActivesInUnit(
    company: string,
    unit: string
  ): Promise<void> {
    const activeRepository = await getDataSource().then(dataSource =>
      dataSource.getMongoRepository(Unit)
    );
    const actives = await activeRepository.find({
      where: { company_id: company, unit_id: unit },
    });
    if (!actives) return;

    actives.forEach(async active => {
      await activeRepository.delete({ _id: new ObjectId(active._id) });
    });
  }
  private async removeUsersInCompany(company: string): Promise<void> {
    const userRepository = await getDataSource().then(dataSource =>
      dataSource.getMongoRepository(User)
    );
    const users = await userRepository.find({
      where: { company_id: company },
    });
    if (!users) return;

    users.forEach(async user => {
      await userRepository.delete({ _id: new ObjectId(user._id) });
    });
  }
}
