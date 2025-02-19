import JawaliResponse from "./JawaliResponse";
export default class JawaliEcommerceInquiryResponse extends JawaliResponse {
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
