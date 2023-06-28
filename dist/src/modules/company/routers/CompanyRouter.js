"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyRouter = void 0;
const CompanyController_1 = require("@company/controllers/CompanyController");
const express_1 = require("express");
class CompanyRouter {
    router;
    constructor() {
        this.router = (0, express_1.Router)();
    }
    routes() {
        this.router.get('/', CompanyController_1.CompanyController.index);
        this.router.get('/:id', CompanyController_1.CompanyController.show);
        this.router.post('/', CompanyController_1.CompanyController.create);
        this.router.put('/:id', CompanyController_1.CompanyController.update);
        this.router.delete('/:id', CompanyController_1.CompanyController.delete);
        return this.router;
    }
}
exports.CompanyRouter = CompanyRouter;
