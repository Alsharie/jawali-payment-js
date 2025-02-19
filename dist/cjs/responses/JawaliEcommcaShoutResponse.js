"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JawaliResponse_1 = __importDefault(require("./JawaliResponse"));
class JawaliEcommcaShoutResponse extends JawaliResponse_1.default {
    getAmount() {
        return this.getResponseBody('amount');
    }
    getCurrency() {
        return this.getResponseBody('Currency');
    }
    getRefId() {
        return this.getResponseBody('refId');
    }
    getIssuerRef() {
        return this.getResponseBody('issuerRef');
    }
}
exports.default = JawaliEcommcaShoutResponse;
