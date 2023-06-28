import { getDataSource } from '@/connection/AppDataSource';
import { BadRequest } from '@/errors/BadRequest';
import { NotFound } from '@/errors/NotFound';
import { Unit } from '@unit/infra/schema/Unit';
import { Company } from '@company/infra/schema/Company';
import { User } from '@user/infra/schema/User';
import { ObjectId } from 'mongodb';
import { Repository } from 'typeorm';
import { Active } from '@active/infra/schema/Active';

export class ListCompanyService {
  constructor(readonly companyRepository: Repository<Company>) {}
  async execute(company_id: string | null, user_id: string | null) {
    if (!user_id) throw new BadRequest('Token not found');
    const companies = company_id
      ? await this.getCompanyByid(company_id)
      : await this.getCompany(user_id);

    const relatedCompanies = await Promise.all(
      companies.map(async company => {
        const total_units = await this.getTotalUnits(company._id.toString());
        const total_actives = await this.getTotalActives(
          company._id.toString()
        );

        return {
          ...company,
          total_units,
          total_actives,
        };
      })
    );

    return relatedCompanies;
  }
  private async getCompanyByid(company_id: string): Promise<Company[]> {
    const company = await this.companyRepository.findOne({
      where: { _id: new ObjectId(company_id) },
    });
    if (!company) {
      throw new NotFound('Company not found');
    }
    return [company];
  }
  private async getCompany(user_id: string): Promise<Company[]> {
    const userRepository = await getDataSource().then(dataSource =>
      dataSource.getMongoRepository(User)
    );
    const user = await userRepository.findOne({
      where: { _id: new ObjectId(user_id) },
    });
    if (!user) {
      throw new BadRequest('User not found');
    }
    if (user.company_id) {
      return await this.getCompanyByid(user.company_id);
    }
    if (!user.is_admin) {
      throw new BadRequest('User is not admin');
    }
    const company = await this.companyRepository.find();
    return company;
  }

  private async getTotalUnits(company_id: string): Promise<number> {
    const unitsRepository = await getDataSource().then(dataSource =>
      dataSource.getMongoRepository(Unit)
    );
    const units = await unitsRepository.find({
      where: { company_id: new ObjectId(company_id) },
    });
    if (!units) {
      return 0;
    }
    return units.length;
  }
  private async getTotalActives(company_id: string): Promise<number> {
    const activesRepository = await getDataSource().then(dataSource =>
      dataSource.getMongoRepository(Active)
    );
    const actives = await activesRepository.find({
      where: { company_id: new ObjectId(company_id) },
    });
    if (!actives) {
      return 0;
    }
    return actives.length;
  }
}
