"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIndexesActives = void 0;
const createIndexesActives = async (collection) => {
    await collection.createIndex({ name: 1, unit_id: 1, company_id: 1 });
};
exports.createIndexesActives = createIndexesActives;
