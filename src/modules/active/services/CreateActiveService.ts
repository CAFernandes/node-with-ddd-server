import { getDataSource } from '@/connection/AppDataSource';
import { BadRequest } from '@/errors/BadRequest';
import { ICreateActiveDTO } from '@active/infra/dtos/ICreateActiveDTO';
import { Active } from '@active/infra/schema/Active';
import { Company } from '@company/infra/schema/Company';
import { Unit } from '@unit/infra/schema/Unit';
import { writeFile } from 'fs';
import { resolve } from 'path';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';

export class CreateActiveService {
  constructor(readonly activeRepository: Repository<Active>) {}
  async execute({
    image,
    name,
    description,
    model,
    proprietary,
    status,
    health_level,
    company_id,
    unit_id,
  }: ICreateActiveDTO) {
    if (
      !name ||
      !description ||
      !model ||
      !proprietary ||
      !status ||
      !health_level ||
      !unit_id ||
      !company_id ||
      !image
    ) {
      throw new BadRequest('Dados inválidos');
    }
    await this.checkIfUnitExists(unit_id);
    await this.checkIfCompanyExist(company_id);
    await this.checkIfActiveExists(name, unit_id, company_id);
    const image_name = `${Date.now()}-${name}.${this.getImageExtension(
      image.data
    )}`;
    this.saveImage(image.data, image_name);
    const created_at = new Date();
    return this.activeRepository.manager.insert(Active, {
      image: image_name,
      name,
      description,
      model,
      proprietary,
      status,
      health_level,
      company_id,
      unit_id,
      created_at,
    });
  }
  private async checkIfActiveExists(
    name: string,
    unit_id: string,
    company_id: string
  ) {
    const active = await this.activeRepository.findOne({
      where: {
        name,
        unit_id,
        company_id,
      },
    });
    if (active) {
      throw new BadRequest('Ativo já cadastrado');
    }
  }
  private async checkIfUnitExists(unit_id: string) {
    const unitsRepository = await getDataSource().then(dataSource =>
      dataSource.getMongoRepository(Unit)
    );
    const unit = await unitsRepository.findOne({
      where: { _id: new ObjectId(unit_id) },
    });
    if (!unit) {
      throw new BadRequest('Unidade não encontrada');
    }
  }
  private async checkIfCompanyExist(company_id: string) {
    const companiesRepository = await getDataSource().then(dataSource =>
      dataSource.getMongoRepository(Company)
    );
    const searchedCompany = await companiesRepository.findOne({
      where: {
        _id: new ObjectId(company_id),
      },
    });
    if (!searchedCompany) {
      throw new BadRequest('Empresa não encontrada');
    }
  }
  private getImageExtension(base64String: string): string | null {
    const matches = base64String.match(/^data:image\/([a-zA-Z0-9]+);base64,/);

    if (matches && matches.length === 2) {
      return matches[1]; // Retorna a extensão encontrada
    }

    return null; // Retorna null se a extensão não for encontrada
  }

  private async saveImage(
    base64String: string,
    nomeArquivo: string
  ): Promise<void> {
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    writeFile(resolve('public', nomeArquivo), buffer, err => {
      if (err) {
        console.error('Erro ao criar arquivo:', err);
        throw err;
      }
    });
  }
}
