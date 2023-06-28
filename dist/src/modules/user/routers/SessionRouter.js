"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionRouter = void 0;
const authenticateToken_1 = require("@middlewares/authenticateToken");
const SessionsController_1 = require("@user/controllers/SessionsController");
const express_1 = require("express");
class SessionRouter {
    router;
    constructor() {
        this.router = (0, express_1.Router)();
    }
    routes() {
        this.router.get('/permissions', authenticateToken_1.authenticateToken, SessionsController_1.SessionController.index);
        this.router.post('/login', SessionsController_1.SessionController.create);
        this.router.delete('/logout', authenticateToken_1.authenticateToken, SessionsController_1.SessionController.delete);
        this.router.post('/refresh-token', SessionsController_1.SessionController.refresh);
        return this.router;
    }
}
exports.SessionRouter = SessionRouter;
