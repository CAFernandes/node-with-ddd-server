"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatabaseAndCollections = void 0;
const logger_1 = require("@/utils/logger");
const mongodb_1 = require("mongodb");
const createIndexesCompanies_1 = require("./createIndexesCompanies");
const createIndexesUnits_1 = require("./createIndexesUnits");
const createIndexesUsers_1 = require("./createIndexesUsers");
const createUserAdministrator_1 = require("./createUserAdministrator");
const createDatabaseAndCollections = async () => {
    const dbName = process.env.DATABASE;
    const mongoUrl = `${process.env.uri}${process.env.user}:${process.env.pass}@${process.env.host}?retryWrites=true&w=majority`;
    logger_1.logger.debug(`Connecting to ${mongoUrl}`);
    const client = await mongodb_1.MongoClient.connect(mongoUrl);
    const listDatabases = await client.db().admin().listDatabases();
    if (listDatabases.databases.find(db => db.name === dbName)) {
        logger_1.logger.info(`Database ${dbName} already exists`);
        await client.close();
        return;
    }
    await createCollections(client.db(dbName));
    logger_1.logger.info(`Database ${dbName} and collections created!`);
    await client.close();
};
exports.createDatabaseAndCollections = createDatabaseAndCollections;
async function createCollections(db) {
    await db.createCollection('companies');
    await db.createCollection('units');
    await db.createCollection('actives');
    await db.createCollection('users');
    await (0, createUserAdministrator_1.createUserAdministrator)(db.collection('users'));
    return await createIndexes(db);
}
async function createIndexes(db) {
    await (0, createIndexesUsers_1.createIndexesUsers)(db.collection('users'));
    await (0, createIndexesCompanies_1.createIndexesCompanies)(db.collection('companies'));
    await (0, createIndexesUnits_1.createIndexesUnits)(db.collection('units'));
}
