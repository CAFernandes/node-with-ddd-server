"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitRouter = void 0;
const UnitsController_1 = require("@unit/controller/UnitsController");
const express_1 = require("express");
class UnitRouter {
    router;
    constructor() {
        this.router = (0, express_1.Router)();
    }
    routes() {
        this.router.get('/', UnitsController_1.UnitsController.index);
        this.router.get('/:id', UnitsController_1.UnitsController.show);
        this.router.post('/', UnitsController_1.UnitsController.create);
        this.router.put('/:id', UnitsController_1.UnitsController.update);
        this.router.delete('/:id', UnitsController_1.UnitsController.delete);
        return this.router;
    }
}
exports.UnitRouter = UnitRouter;
