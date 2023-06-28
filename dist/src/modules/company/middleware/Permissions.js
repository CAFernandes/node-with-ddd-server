"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userCompanyPermissions = exports.adminPermissions = void 0;
exports.adminPermissions = [
    'company:create',
    'company:read',
    'company:update',
    'company:delete',
    'user:create',
    'user:read',
    'user:update',
    'user:delete',
];
exports.userCompanyPermissions = [
    'company:read',
    'unit:create',
    'unit:read',
    'unit:update',
    'unit:delete',
    'active:create',
    'active:read',
    'active:update',
    'active:delete',
];
