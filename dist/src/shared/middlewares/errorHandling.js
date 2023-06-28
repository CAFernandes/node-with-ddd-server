"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandling = void 0;
const AppError_1 = require("@/errors/AppError");
const BadRequest_1 = require("@/errors/BadRequest");
const NotFound_1 = require("@/errors/NotFound");
const UnauthorizedError_1 = require("@/errors/UnauthorizedError");
const logger_1 = require("@/utils/logger");
const errorHandling = (err, _, res, __) => {
    logger_1.logger.info('errorHandling() - Handling error');
    logger_1.logger.fatal(err);
    if (err instanceof AppError_1.AppError)
        return res.status(err.code).json({ status: 'error', message: err.message });
    if (err instanceof UnauthorizedError_1.UnauthorizedError)
        return res.status(err.code).json({ status: 'error', message: err.message });
    if (err instanceof BadRequest_1.BadRequest)
        return res.status(err.code).json({ status: 'error', message: err.message });
    if (err instanceof NotFound_1.NotFound)
        return res.status(err.code).json({ status: 'error', message: err.message });
    const error = new AppError_1.AppError(500, err.name, err);
    error.saveError();
    return res.status(500).json({ status: 'error', message: error, err });
};
exports.errorHandling = errorHandling;
