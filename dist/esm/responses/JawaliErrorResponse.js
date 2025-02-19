import JawaliResponse from "./JawaliResponse";
export default class JawaliErrorResponse extends JawaliResponse {
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
