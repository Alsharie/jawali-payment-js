"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JawaliResponse_1 = __importDefault(require("./JawaliResponse"));
class JawaliEcommerceInquiryResponse extends JawaliResponse_1.default {
    constructor(response) {
        super(response);
    }
    getAmount() {
        return this.getResponseBody('txnamount');
    }
    getCurrency() {
        return this.getResponseBody('txncurrency');
    }
    getState() {
        return this.getResponseBody('state');
    }
    getTransactionRef() {
        return this.getResponseBody('issuerTrxRef');
    }
}
exports.default = JawaliEcommerceInquiryResponse;
