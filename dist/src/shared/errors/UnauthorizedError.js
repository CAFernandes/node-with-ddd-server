"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = void 0;
const logger_1 = require("@/utils/logger");
class UnauthorizedError extends Error {
    code;
    message;
    logger;
    constructor(message) {
        super(message);
        this.code = 401;
        this.message = message;
        this.logger = logger_1.logger;
    }
    saveError() {
        this.logger.level = 'error';
        this.logger.fatal(`${this.message}`);
    }
}
exports.UnauthorizedError = UnauthorizedError;
