import JawaliResponse from "./JawaliResponse";

export default class JawaliWalletAuthResponse extends JawaliResponse {
    getAccessToken() {
        return this.getResponseBody('access_token');
    }
}
