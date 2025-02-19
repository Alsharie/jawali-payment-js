"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAxiosInstance = createAxiosInstance;
const axios_1 = __importDefault(require("axios"));
const https_1 = __importDefault(require("https"));
function createAxiosInstance(disableSslVerification) {
    return axios_1.default.create({
        httpsAgent: new https_1.default.Agent({
            rejectUnauthorized: !disableSslVerification, // Value comes from config
        }),
    });
}
