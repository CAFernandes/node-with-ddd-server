"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerRequest = void 0;
const logger_1 = require("@/utils/logger");
const loggerRequest = (req, res, next) => {
    const { method, url, body, query } = req;
    logger_1.logger.trace({
        method,
        rota: url.split('?')[0],
        query,
        body,
    });
    next();
};
exports.loggerRequest = loggerRequest;
