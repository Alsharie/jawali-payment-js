class JawaliResponse {

    public data: any;
    public success: boolean;

    constructor(response: any) {
        this.data = typeof response === 'string' ? JSON.parse(response) : response;
        this.success = this.isSuccess()
    }

    public getResponseBody(attr?: string) {
        if (attr && this.data.responseBody) {
            return this.data.responseBody[attr] || null;
        }
        return this.data.responseBody || this.data;
    }


    public getResponse(attr?: string) {
        if (attr) {
            return this.data[attr] || null;
        }
        return this.data;
    }

    public isSuccess() {
        return this.data.responseStatus && this.data.responseStatus.systemStatus == '0';
    }
}

export default JawaliResponse;