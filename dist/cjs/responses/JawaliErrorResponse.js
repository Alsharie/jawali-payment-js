"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JawaliResponse_1 = __importDefault(require("./JawaliResponse"));
class JawaliErrorResponse extends JawaliResponse_1.default {
    constructor(response, status) {
        super(response);
        this.success = false;
        try {
            this.data = typeof response === 'string' ? JSON.parse(response) : response;
        }
        catch (e) {
            this.data = { message: response };
        }
        this.data.status_code = status;
    }
}
exports.default = JawaliErrorResponse;
