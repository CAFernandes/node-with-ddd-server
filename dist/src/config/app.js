"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const https_1 = __importDefault(require("https"));
const fs_1 = require("fs");
const path_1 = require("path");
require("reflect-metadata");
const logger_1 = require("@/utils/logger");
const ActiveRouter_1 = require("@active/routers/ActiveRouter");
const CompanyRouter_1 = require("@company/routers/CompanyRouter");
const authenticateToken_1 = require("@middlewares/authenticateToken");
const errorHandling_1 = require("@middlewares/errorHandling");
const loggerRequest_1 = require("@middlewares/loggerRequest");
const UnitRouter_1 = require("@unit/routers/UnitRouter");
const SessionRouter_1 = require("@user/routers/SessionRouter");
const UserRouter_1 = require("@user/routers/UserRouter");
const createDatabaseAndCollections_1 = require("./services/createDatabaseAndCollections");
class App {
    app;
    server;
    options;
    constructor() {
        this.app = (0, express_1.default)();
        this.options = {
            key: (0, fs_1.readFileSync)((0, path_1.resolve)(__dirname, 'certs', 'key.pem')),
            cert: (0, fs_1.readFileSync)((0, path_1.resolve)(__dirname, 'certs', 'cert.pem')),
            pfx: (0, fs_1.readFileSync)((0, path_1.resolve)(__dirname, 'certs', 'cert.pfx')),
            passphrase: '281296',
        };
        this.middleware();
    }
    middleware() {
        (0, createDatabaseAndCollections_1.createDatabaseAndCollections)();
        this.app.use((0, helmet_1.default)({
            contentSecurityPolicy: true,
            crossOriginResourcePolicy: { policy: 'cross-origin' },
        }));
        this.app.use((0, cors_1.default)({
            origin: 'http://localhost:5173',
        }));
        this.app.use(express_1.default.json({ limit: '25mb' }));
        this.app.use(express_1.default.urlencoded({ limit: '25mb', extended: true }));
        if (process.env.REQUEST_INTERCEPT)
            this.app.use(loggerRequest_1.loggerRequest);
        this.routes();
    }
    async routes() {
        this.app.use('/image', express_1.default.static((0, path_1.resolve)('public')));
        this.app.use('/auth', new SessionRouter_1.SessionRouter().routes());
        this.app.use('/user', authenticateToken_1.authenticateToken, new UserRouter_1.UserRouter().routes());
        this.app.use('/company', authenticateToken_1.authenticateToken, new CompanyRouter_1.CompanyRouter().routes());
        this.app.use('/unit', authenticateToken_1.authenticateToken, new UnitRouter_1.UnitRouter().routes());
        this.app.use('/active', authenticateToken_1.authenticateToken, new ActiveRouter_1.ActiveRouter().routes());
        this.app.use(errorHandling_1.errorHandling);
    }
    listen(httpsPort, httpPort) {
        this.server = https_1.default.createServer(this.options, this.app);
        this.server.listen(httpsPort, () => {
            logger_1.logger.level = 'debug';
            logger_1.logger.info(`Backend Staterd in: https://localhost:${httpsPort}`);
            logger_1.logger.info(`Ambiente: ${process.env.TS_NODE_DEV ? 'DEVELOPMENT' : 'PRODUCTION'}`);
        });
        this.app.listen(httpPort, () => {
            logger_1.logger.level = 'debug';
            logger_1.logger.info(`Backend Staterd in: http://localhost:${httpPort}`);
            logger_1.logger.info(`Ambiente: ${process.env.TS_NODE_DEV ? 'DEVELOPMENT' : 'PRODUCTION'}`);
        });
    }
    die() {
        process.exit(0);
    }
}
exports.default = new App();
