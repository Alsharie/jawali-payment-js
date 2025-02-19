import AuthHelper from './authHelper'
import JawaliLoginResponse from './responses/JawaliLoginResponse'
import JawaliWalletAuthResponse from './responses/JawaliWalletAuthResponse'
import JawaliEcommerceInquiryResponse from './responses/JawaliEcommerceInquiryResponse'
import JawaliEcommcaShoutResponse from './responses/JawaliEcommcaShoutResponse'
import JawaliErrorResponse from './responses/JawaliErrorResponse'
import { JawaliConfig } from './config/jawali'
import { createAxiosInstance } from './axiosInstance'
import { log } from 'console'
import { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import axiosRetry from "axios-retry";

class JawaliGateway {
    private authHelper: AuthHelper
    private config: JawaliConfig
    private attributes: any
    private requestHeaders: any = {}
    private axiosInstance: AxiosInstance;
    
    constructor(config: JawaliConfig) {
        this.config = config
        this.authHelper = new AuthHelper()

        this.axiosInstance = createAxiosInstance(config.url.disableSslVerification);

        // Request interceptor: attach the auth token
        this.axiosInstance.interceptors.request.use(
            (config) => {
                config.headers = config.headers || {};
                config.headers['Authorization'] = `Bearer ${this.authHelper.getAuthToken()}`;
                if (config.headers) {
                    delete config.headers['Content-Length'];
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor for handling token issues in successful responses
        this.axiosInstance.interceptors.response.use(
            async (response: AxiosResponse) => {

                // Check if the response contains token error messages.
                // (Adjust the logic as needed for your API.)
                const dataStr =
                    typeof response.data === 'string'
                        ? response.data.toLowerCase()
                        : response.data.toString();
                const errorStr = response.data?.error?.toLowerCase?.() || '';
                if (
                    dataStr.includes('invalid access token') ||
                    dataStr.includes('access token expired') ||
                    errorStr.includes('invalid access token') ||
                    errorStr.includes('access token expired')
                ) {
                    // Token issue detected in a successful response
                    const originalRequest = response.config as any;
                    if (!originalRequest._retry) {
                        originalRequest._retry = true;
                        console.log('Token issue detected in response - refreshing...');
                        const refreshed = await this.refreshTokens();
                        if (!refreshed) {
                            throw new Error('Token refresh failed');
                        }
                        this.setAuthorization();
                        this.setWalletAuthAttributes();

                        // Update the header with the new token
                        originalRequest.headers['Authorization'] = `Bearer ${this.authHelper.getAuthToken()}`;

                        // Update the request body if needed
                        let data = { ...JSON.parse(originalRequest.data) };
                        data.body.accessToken = this.authHelper.getWalletToken();
                        data.body.refId = this.generateRefIdSimple();
                        originalRequest.data = JSON.stringify(data);

                        // Reject with a custom error so axios-retry triggers a retry.
                        const customError = new Error('Token refreshed - retrying');
                        (customError as any).config = originalRequest;
                        // Mimic an unauthorized response for axios-retry
                        (customError as any).response = { status: 401 };
                        return Promise.reject(customError);
                    }
                }
                return response;
            },
            // Error branch: for 400/401 responses
            async (error: AxiosError) => {
                const originalRequest = error.config as any;
                console.log('-------------Error start--------------')
                console.log('Error URL:', originalRequest?.url);
                console.log('Error response:', error.response?.data);
                console.log('-------------Error end--------------')

                if (
                    (error.response?.status === 400 || error.response?.status === 401) &&
                    !originalRequest._retry
                ) {
                    originalRequest._retry = true;
                    console.log('Unauthorized error - refreshing tokens...', error.response?.status);
                    const refreshed = await this.refreshTokens();
                    if (!refreshed) {
                        return Promise.reject(error);
                    }
                    this.setAuthorization();
                    this.setWalletAuthAttributes();

                    originalRequest.headers['Authorization'] = `Bearer ${this.authHelper.getAuthToken()}`;
                    let data = { ...JSON.parse(originalRequest.data) };
                    data.body.accessToken = this.authHelper.getWalletToken();
                    data.body.refId = this.generateRefIdSimple();
                    originalRequest.data = JSON.stringify(data);

                    // Reject so that axios-retry can retry the request.
                    return Promise.reject(error);
                }
                return Promise.reject(error);
            }
        );

        // Configure axios-retry to retry 1 time when receiving a 400 or 401 error.
        axiosRetry(this.axiosInstance, {
            retries: 2,
            retryCondition: (error: AxiosError) => {
                return error.response?.status === 400 || error.response?.status === 401;
            },
            retryDelay: () => 0, // Immediate retry
        });
    }

    // -------------------------------
    // Utility methods
    // -------------------------------
    private generateCorrID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    private generateClientDate(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}${month}${day}${hours}${minutes}`;
    }

    private generateRefIdSimple(): string {
        return Date.now().toString();
    }

    // -------------------------------
    // Attribute setters
    // -------------------------------
    private setInitAttributes(): void {
        this.attributes = {
            header: {
                serviceDetail: {
                    corrId: this.generateCorrID(),
                    domainName: 'WalletDomain', // default; can be overridden
                },
                signonDetail: {
                    clientID: 'WeCash', // default; may be enhanced in setsignnDetail
                },
                messageContext: {
                    clientDate: this.generateClientDate(),
                    bodyType: 'Clear',
                },
            },
            body: {},
        }
        this.setSignonDetail()
    }

    private setAuthAttributes(): void {
        // For login; note that we are not setting header/body here
        this.attributes = {
            username: this.config.auth.username,
            password: this.config.auth.password,
            grant_type: 'password',
            client_id: 'restapp',
            client_secret: 'restapp',
            scope: 'read'
        };
    }

    private setWalletLoginAttributes(): void {
        if (!this.attributes.body) this.attributes.body = {};
        this.attributes.body.identifier = this.config.auth.wallet_identifier;
        this.attributes.body.password = this.config.auth.wallet_password;
    }

    private setWalletAuthAttributes(): void {
        if (!this.attributes.body) this.attributes.body = {};
        this.attributes.body.agentWallet = this.config.auth.wallet;
        this.attributes.body.password = this.config.auth.wallet_password;
        this.attributes.body.accessToken = this.authHelper.getWalletToken();
    }

    private setServiceScope(service: string): void {
        if (!this.attributes.header) this.attributes.header = {};
        if (!this.attributes.header.serviceDetail) this.attributes.header.serviceDetail = {};
        this.attributes.header.serviceDetail.serviceName = service;
    }

    private setServiceDomain(domain: string): void {
        if (!this.attributes.header) this.attributes.header = {};
        if (!this.attributes.header.serviceDetail) this.attributes.header.serviceDetail = {};
        this.attributes.header.serviceDetail.domainName = domain;
    }

    private setSignonDetail(): void {
        if (!this.attributes.header) this.attributes.header = {};
        if (!this.attributes.header.signonDetail) this.attributes.header.signonDetail = {};
        this.attributes.header.signonDetail.orgID = this.config.auth.org_id;
        this.attributes.header.signonDetail.userID = this.config.auth.user_id;
        this.attributes.header.signonDetail.externalUser = this.config.auth.external_user;
    }

    private setAuthorization(): void {
        this.requestHeaders.Authorization = `Bearer ${this.authHelper.getAuthToken()}`;
    }

    private setRefId(): void {
        if (!this.attributes.body) this.attributes.body = {};
        this.attributes.body.refId = this.generateRefIdSimple();
    }

    // -------------------------------
    // Gateway API Methods
    // -------------------------------
    async login(): Promise<JawaliLoginResponse | JawaliErrorResponse> {
        this.setAuthAttributes();
        try {
            // Avoid recursive refresh calls by setting shouldRefreshToken to false here.
            const responseJson = await this.sendRequest(
                `${this.config.url.base}/oauth/token`,
                this.attributes,
                true // use form URL-encoded for login (if required)
            );
            this.authHelper.setAuthToken(responseJson.access_token);
            return new JawaliLoginResponse(responseJson);
        } catch (error: any) {
            return error;
        }
    }

    async walletAuth(): Promise<JawaliWalletAuthResponse | JawaliErrorResponse> {
        this.setInitAttributes();
        this.setWalletLoginAttributes();
        this.setAuthorization();
        this.setServiceScope('PAYWA.WALLETAUTHENTICATION');
        try {
            // Avoid token refresh during auth calls here.
            const responseJson = await this.sendRequest(
                `${this.config.url.base}/v1/ws/callWS`,
                this.attributes,
            );

            this.authHelper.setWalletToken(responseJson.responseBody.access_token);
            return new JawaliWalletAuthResponse(responseJson);
        } catch (error: any) {
            return error;
        }
    }

    async ecommerceInquiry(voucher: string, receiverMobile: string, purpose: string = ''): Promise<JawaliEcommerceInquiryResponse | JawaliErrorResponse> {
        this.setInitAttributes();
        this.setAuthorization();
        this.setWalletAuthAttributes();
        this.setServiceScope('PAYAG.ECOMMERCEINQUIRY');
        this.setServiceDomain('MerchantDomain');
        this.setRefId();
        this.attributes.body.voucher = voucher;
        this.attributes.body.purpose = purpose;
        this.attributes.body.receiverMobile = receiverMobile;

        try {
            const responseJson = await this.sendRequest(
                `${this.config.url.base}/v1/ws/callWS`,
                this.attributes
            );
            return new JawaliEcommerceInquiryResponse(responseJson);
        } catch (error: any) {
            return error;
        }
    }

    async ecommcaShout(voucher: string, receiverMobile: string, purpose: string = ''): Promise<JawaliEcommcaShoutResponse | JawaliErrorResponse> {
        this.setInitAttributes();
        this.setAuthorization();
        this.setWalletAuthAttributes();
        this.setServiceScope('PAYAG.ECOMMCASHOUT');
        this.setServiceDomain('MerchantDomain');
        this.setRefId();
        this.attributes.body.voucher = voucher;
        this.attributes.body.purpose = purpose;
        this.attributes.body.receiverMobile = receiverMobile;
        try {
            const responseJson = await this.sendRequest(
                `${this.config.url.base}/v1/ws/callWS`,
                this.attributes
            );
            return new JawaliEcommcaShoutResponse(responseJson);
        } catch (error: any) {
            return error;
        }
    }

    // -------------------------------
    // sendRequest with retry & token refresh logic
    // -------------------------------
    private async sendRequest(
        url: string,
        data: any,
        useFormUrlEncoded = false
    ): Promise<any> {
        // For form encoded requests (e.g. login) use qs.stringify if needed.
        const headers = {
            'Content-Type': useFormUrlEncoded
                ? 'application/x-www-form-urlencoded'
                : 'application/json',
            ...this.requestHeaders
        };

        try {
            const response = await this.axiosInstance.post(url, data, { headers });
            const responseData = response.data;
            const jsonData = typeof responseData === 'string'
                ? JSON.parse(responseData)
                : responseData;
            // Here we still check for business-level token errors
            const errorMsg = (jsonData.error || '').toLowerCase();
            if (
                errorMsg.includes('invalid access token') || errorMsg.includes('access token expired')
            ) {
                throw new JawaliErrorResponse('Token error', 401);
            }
            return jsonData;
        } catch (error: any) {
            log('------------------------');
            log('Request error:', error.response?.data || error.message);
            return new JawaliErrorResponse(error.response?.data || error.message, error.response?.status);
        }
    }

    private async refreshTokens() {
        try {
            const loginResponse = await this.login();
            if (loginResponse instanceof JawaliLoginResponse) {
                try {
                    await this.walletAuth();
                    return true;
                } catch (error) {
                    console.error('Wallet auth failed:', error);
                    return false;
                }
            }
            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    }
}

export default JawaliGateway;