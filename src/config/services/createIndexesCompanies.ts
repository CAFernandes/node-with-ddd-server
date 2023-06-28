import { Collection, Document } from 'mongodb';

export const createIndexesCompanies = async (
  collection: Collection<Document>
) => {
  await collection.createIndex({ name: 1 });
};
