"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveRouter = void 0;
const ActiveController_1 = require("@active/controller/ActiveController");
const express_1 = require("express");
class ActiveRouter {
    router;
    constructor() {
        this.router = (0, express_1.Router)();
    }
    routes() {
        this.router.get('/', ActiveController_1.ActiveController.index);
        this.router.get('/:unit', ActiveController_1.ActiveController.index);
        this.router.get('/:unit/:id', ActiveController_1.ActiveController.show);
        this.router.post('/', ActiveController_1.ActiveController.create);
        this.router.put('/:id', ActiveController_1.ActiveController.update);
        this.router.delete('/:id', ActiveController_1.ActiveController.delete);
        return this.router;
    }
}
exports.ActiveRouter = ActiveRouter;
