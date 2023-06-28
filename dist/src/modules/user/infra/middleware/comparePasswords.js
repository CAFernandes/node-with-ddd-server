"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePasswords = void 0;
const bcrypt_1 = require("bcrypt");
const comparePasswords = async (password, hashedPassword) => {
    return await (0, bcrypt_1.compare)(password, hashedPassword);
};
exports.comparePasswords = comparePasswords;
