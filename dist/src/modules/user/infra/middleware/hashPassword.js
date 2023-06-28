"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = void 0;
const bcrypt_1 = require("bcrypt");
const saltRound = 10;
const hashPassword = async (password) => {
    return await (0, bcrypt_1.hash)(password, saltRound);
};
exports.hashPassword = hashPassword;
