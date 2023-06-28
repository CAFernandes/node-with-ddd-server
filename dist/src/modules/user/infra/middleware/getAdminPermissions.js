"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminPermissions = void 0;
const administrator_1 = require("../permissions/administrator");
const getAdminPermissions = async () => {
    return administrator_1.administrator.can;
};
exports.getAdminPermissions = getAdminPermissions;
