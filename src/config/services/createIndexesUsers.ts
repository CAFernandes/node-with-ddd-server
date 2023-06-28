import { Collection, Document } from 'mongodb';

export const createIndexesUsers = async (collection: Collection<Document>) => {
  await collection.createIndex({ company_id: 1 });
  await collection.createIndex({ username: 1 });
};
