"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIndexesUnits = void 0;
const createIndexesUnits = async (collection) => {
    await collection.createIndex({ company_id: 1 });
    await collection.createIndex({ name: 1, company_id: 1 });
};
exports.createIndexesUnits = createIndexesUnits;
