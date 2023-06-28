"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserAdministrator = void 0;
const hashPassword_1 = require("@user/infra/middleware/hashPassword");
const createUserAdministrator = async (collection) => {
    const user = {
        name: process.env.ADMINISTRATOR_NAME || 'Administrator',
        username: process.env.ADMIN_USERNAME || 'admin',
        password: await (0, hashPassword_1.hashPassword)(process.env.ADMIN_PASSWORD || 'admin'),
        is_admin: true,
        create_at: new Date(),
    };
    collection.insertOne(user);
};
exports.createUserAdministrator = createUserAdministrator;
