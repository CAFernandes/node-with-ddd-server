"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const mongodb_1 = require("mongodb");
const Company_1 = require("@company/infra/schema/Company");
let User = exports.User = class User {
    constructor(props, id) {
        Object.assign(this, props);
        if (!id) {
            this._id = new mongodb_1.ObjectId();
        }
    }
    relation;
    _id;
    is_admin;
    company_id;
    name;
    username;
    password;
    created_at;
    update_at;
    refresh_token;
    company;
};
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", mongodb_1.ObjectId)
], User.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], User.prototype, "is_admin", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "company_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], User.prototype, "update_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Object)
], User.prototype, "refresh_token", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Company_1.Company, company => company.users),
    __metadata("design:type", Company_1.Company)
], User.prototype, "company", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users'),
    __metadata("design:paramtypes", [Object, String])
], User);
