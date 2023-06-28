"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const log4js_1 = require("log4js");
if (process.env.SAVE_LOG == 'true') {
    (0, log4js_1.configure)({
        appenders: {
            file: {
                type: 'file',
                filename: 'api.log',
                maxLogSize: 10 * 1024 * 1024,
                backups: 5,
                compress: true,
                encoding: 'utf-8',
                mode: 0o0640,
                flags: 'w+',
            },
            dateFile: {
                type: 'dateFile',
                filename: 'api.log',
                pattern: 'yyyy-MM-dd-hh',
                compress: true,
            },
            out: {
                type: 'stdout',
            },
        },
        categories: {
            default: { appenders: ['file', 'dateFile', 'out'], level: 'trace' },
        },
    });
}
exports.logger = (0, log4js_1.getLogger)('Tractian');
