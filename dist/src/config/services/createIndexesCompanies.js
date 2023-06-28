"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIndexesCompanies = void 0;
const createIndexesCompanies = async (collection) => {
    await collection.createIndex({ name: 1 });
};
exports.createIndexesCompanies = createIndexesCompanies;
