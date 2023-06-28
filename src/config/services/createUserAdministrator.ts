import { hashPassword } from '@user/infra/middleware/hashPassword';
import { administrator } from '@user/infra/permissions/administrator';
import { Collection, Document } from 'mongodb';

export const createUserAdministrator = async (
  collection: Collection<Document>
) => {
  const user = {
    name: process.env.ADMINISTRATOR_NAME || 'Administrator',
    username: process.env.ADMIN_USERNAME || 'admin',
    password: await hashPassword(process.env.ADMIN_PASSWORD || 'admin'),
    is_admin: true,
    create_at: new Date(),
  };
  collection.insertOne(user);
};
