class JawaliResponse {
    constructor(response) {
        this.data = typeof response === 'string' ? JSON.parse(response) : response;
        this.success = this.isSuccess();
    }
    getResponseBody(attr) {
        if (attr && this.data.responseBody) {
            return this.data.responseBody[attr] || null;
        }
        return this.data.responseBody || this.data;
    }
    getResponse(attr) {
        if (attr) {
            return this.data[attr] || null;
        }
        return this.data;
    }
    isSuccess() {
        return this.data.responseStatus && this.data.responseStatus.systemStatus == '0';
    }
}
export default JawaliResponse;
