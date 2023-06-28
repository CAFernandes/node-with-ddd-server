import { Collection, Document } from 'mongodb';

export const createIndexesUnits = async (collection: Collection<Document>) => {
  await collection.createIndex({ company_id: 1 });
  await collection.createIndex({ name: 1, company_id: 1 });
};
