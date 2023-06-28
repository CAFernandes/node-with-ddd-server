"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataSource = void 0;
const logger_1 = require("@/utils/logger");
const Active_1 = require("@active/infra/schema/Active");
const Company_1 = require("@company/infra/schema/Company");
const Unit_1 = require("@unit/infra/schema/Unit");
const User_1 = require("@user/infra/schema/User");
const typeorm_1 = require("typeorm");
const AppDataSource = new typeorm_1.DataSource({
    type: 'mongodb',
    url: `${process.env.uri}${process.env.user}:${process.env.pass}@${process.env.host}/${process.env.DATABASE}?authSource=admin`,
    entities: [Company_1.Company, Unit_1.Unit, User_1.User, Active_1.Active],
    subscribers: [],
});
AppDataSource.initialize()
    .then(async () => {
    logger_1.logger.info('Connection with database already initialized');
})
    .catch(error => logger_1.logger.fatal(error));
const getDataSource = (delay = 200) => {
    if (AppDataSource.isInitialized) {
        return Promise.resolve(AppDataSource);
    }
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (AppDataSource.isInitialized)
                resolve(AppDataSource);
            else
                reject('Failed to create connection with database');
        }, delay);
    });
};
exports.getDataSource = getDataSource;
