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
exports.Unit = void 0;
const typeorm_1 = require("typeorm");
const Company_1 = require("@company/infra/schema/Company");
const Active_1 = require("@active/infra/schema/Active");
let Unit = exports.Unit = class Unit {
    _id;
    name;
    company_id;
    created_at;
    updated_at;
    company;
    active;
};
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeorm_1.ObjectId)
], Unit.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Unit.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Unit.prototype, "company_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Unit.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Unit.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Company_1.Company, company => company.units),
    __metadata("design:type", Company_1.Company)
], Unit.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Active_1.Active, active => active.unit),
    __metadata("design:type", Array)
], Unit.prototype, "active", void 0);
exports.Unit = Unit = __decorate([
    (0, typeorm_1.Entity)('units')
], Unit);
