"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
const logger_1 = require("@/utils/logger");
class AppError extends Error {
    code;
    message;
    error;
    logger;
    constructor(code = 400, message, error) {
        super(message);
        this.code = code;
        this.message = message;
        this.error = error;
        this.logger = logger_1.logger;
    }
    saveError() {
        this.logger.level = 'error';
        this.logger.fatal(`${this.message} - ${this.error?.message} ${this.error?.stack}`);
    }
}
exports.AppError = AppError;
