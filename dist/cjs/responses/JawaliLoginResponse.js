"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JawaliResponse_1 = __importDefault(require("./JawaliResponse"));
class JawaliLoginResponse extends JawaliResponse_1.default {
    getAccessToken() {
        return this.getResponse('access_token');
    }
}
exports.default = JawaliLoginResponse;
