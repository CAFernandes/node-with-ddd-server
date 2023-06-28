"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const UsersController_1 = require("@user/controllers/UsersController");
const logger_1 = require("@/utils/logger");
class UserRouter {
    router;
    constructor() {
        this.router = (0, express_1.Router)();
    }
    routes() {
        logger_1.logger.info('UserRouter.routes() - Configuring routes');
        this.router.get('/', UsersController_1.UsersController.index);
        this.router.get('/me', UsersController_1.UsersController.me);
        this.router.put('/reset-password', UsersController_1.UsersController.resetPassword);
        this.router.post('/', UsersController_1.UsersController.create);
        this.router.get('/:id', UsersController_1.UsersController.show);
        this.router.put('/:id', UsersController_1.UsersController.update);
        this.router.delete('/:id', UsersController_1.UsersController.delete);
        return this.router;
    }
}
exports.UserRouter = UserRouter;
