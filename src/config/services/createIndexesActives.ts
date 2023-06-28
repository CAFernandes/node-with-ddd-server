import { Collection, Document } from 'mongodb';

export const createIndexesActives = async (
  collection: Collection<Document>
) => {
  await collection.createIndex(
    { name: 1, unit_id: 1, company_id: 1 }
    // { unique: true }
  );
};
