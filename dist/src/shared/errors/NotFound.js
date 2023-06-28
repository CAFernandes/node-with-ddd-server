"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFound = void 0;
class NotFound extends Error {
    code = 404;
    constructor(message) {
        super(message);
        this.name = 'BadRequest';
    }
}
exports.NotFound = NotFound;
