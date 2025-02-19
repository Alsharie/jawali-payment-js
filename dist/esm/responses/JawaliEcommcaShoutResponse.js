import JawaliResponse from "./JawaliResponse";
export default class JawaliEcommcaShoutResponse extends JawaliResponse {
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
