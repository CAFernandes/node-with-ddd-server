"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPermissions = void 0;
const company_user_1 = require("../permissions/company_user");
const getUserPermissions = async () => {
    return company_user_1.company_user.can;
};
exports.getUserPermissions = getUserPermissions;
