"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIndexesUsers = void 0;
const createIndexesUsers = async (collection) => {
    await collection.createIndex({ company_id: 1 });
    await collection.createIndex({ username: 1 });
};
exports.createIndexesUsers = createIndexesUsers;
