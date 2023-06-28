"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequest = void 0;
class BadRequest extends Error {
    code = 400;
    constructor(message) {
        super(message);
        this.name = 'BadRequest';
    }
}
exports.BadRequest = BadRequest;
