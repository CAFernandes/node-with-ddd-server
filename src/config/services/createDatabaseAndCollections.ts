import { logger } from '@/utils/logger';
import { Db, MongoClient } from 'mongodb';
import { createIndexesCompanies } from './createIndexesCompanies';
import { createIndexesUnits } from './createIndexesUnits';
import { createIndexesUsers } from './createIndexesUsers';
import { createUserAdministrator } from './createUserAdministrator';

export const createDatabaseAndCollections = async () => {
  const dbName = process.env.DATABASE;
  const mongoUrl = `${process.env.uri}${process.env.user}:${process.env.pass}@${process.env.host}?retryWrites=true&w=majority`;
  logger.debug(`Connecting to ${mongoUrl}`);
  const client = await MongoClient.connect(mongoUrl);

  const listDatabases = await client.db().admin().listDatabases();
  if (listDatabases.databases.find(db => db.name === dbName)) {
    logger.info(`Database ${dbName} already exists`);
    await client.close();
    return;
  }

  await createCollections(client.db(dbName));
  logger.info(`Database ${dbName} and collections created!`);
  await client.close();
};

async function createCollections(db: Db) {
  await db.createCollection('companies');
  await db.createCollection('units');
  await db.createCollection('actives');
  await db.createCollection('users');

  await createUserAdministrator(db.collection('users'));
  return await createIndexes(db);
}
async function createIndexes(db: Db) {
  await createIndexesUsers(db.collection('users'));
  await createIndexesCompanies(db.collection('companies'));
  await createIndexesUnits(db.collection('units'));
}
