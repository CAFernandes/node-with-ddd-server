"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("@config/app"));
app_1.default.listen(Number(process.env.HTTPSPORT) || 443, Number(process.env.HTTPPORT) || 80);
process.once('SIGINT', () => app_1.default.die());
