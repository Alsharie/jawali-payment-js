import JawaliResponse from "./JawaliResponse";


export default class JawaliLoginResponse extends JawaliResponse {
    getAccessToken() {
        return this.getResponse('access_token');
    }
}

