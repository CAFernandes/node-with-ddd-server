"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateActiveService = void 0;
const AppDataSource_1 = require("@/connection/AppDataSource");
const BadRequest_1 = require("@/errors/BadRequest");
const Active_1 = require("@active/infra/schema/Active");
const Company_1 = require("@company/infra/schema/Company");
const Unit_1 = require("@unit/infra/schema/Unit");
const fs_1 = require("fs");
const path_1 = require("path");
const mongodb_1 = require("mongodb");
class CreateActiveService {
    activeRepository;
    constructor(activeRepository) {
        this.activeRepository = activeRepository;
    }
    async execute({ image, name, description, model, proprietary, status, health_level, company_id, unit_id, }) {
        if (!name ||
            !description ||
            !model ||
            !proprietary ||
            !status ||
            !health_level ||
            !unit_id ||
            !company_id ||
            !image) {
            throw new BadRequest_1.BadRequest('Dados inválidos');
        }
        await this.checkIfUnitExists(unit_id);
        await this.checkIfCompanyExist(company_id);
        await this.checkIfActiveExists(name, unit_id, company_id);
        const image_name = `${Date.now()}-${name}.${this.getImageExtension(image.data)}`;
        this.saveImage(image.data, image_name);
        const created_at = new Date();
        return this.activeRepository.manager.insert(Active_1.Active, {
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
    async checkIfActiveExists(name, unit_id, company_id) {
        const active = await this.activeRepository.findOne({
            where: {
                name,
                unit_id,
                company_id,
            },
        });
        if (active) {
            throw new BadRequest_1.BadRequest('Ativo já cadastrado');
        }
    }
    async checkIfUnitExists(unit_id) {
        const unitsRepository = await (0, AppDataSource_1.getDataSource)().then(dataSource => dataSource.getMongoRepository(Unit_1.Unit));
        const unit = await unitsRepository.findOne({
            where: { _id: new mongodb_1.ObjectId(unit_id) },
        });
        if (!unit) {
            throw new BadRequest_1.BadRequest('Unidade não encontrada');
        }
    }
    async checkIfCompanyExist(company_id) {
        const companiesRepository = await (0, AppDataSource_1.getDataSource)().then(dataSource => dataSource.getMongoRepository(Company_1.Company));
        const searchedCompany = await companiesRepository.findOne({
            where: {
                _id: new mongodb_1.ObjectId(company_id),
            },
        });
        if (!searchedCompany) {
            throw new BadRequest_1.BadRequest('Empresa não encontrada');
        }
    }
    getImageExtension(base64String) {
        const matches = base64String.match(/^data:image\/([a-zA-Z0-9]+);base64,/);
        if (matches && matches.length === 2) {
            return matches[1];
        }
        return null;
    }
    async saveImage(base64String, nomeArquivo) {
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        (0, fs_1.writeFile)((0, path_1.resolve)('public', nomeArquivo), buffer, err => {
            if (err) {
                console.error('Erro ao criar arquivo:', err);
                throw err;
            }
        });
    }
}
exports.CreateActiveService = CreateActiveService;
