import JawaliLoginResponse from './responses/JawaliLoginResponse';
import JawaliWalletAuthResponse from './responses/JawaliWalletAuthResponse';
import JawaliEcommerceInquiryResponse from './responses/JawaliEcommerceInquiryResponse';
import JawaliEcommcaShoutResponse from './responses/JawaliEcommcaShoutResponse';
import JawaliErrorResponse from './responses/JawaliErrorResponse';
import { JawaliConfig } from './config/jawali';
declare class JawaliGateway {
    private authHelper;
    private config;
    private attributes;
    private requestHeaders;
    private axiosInstance;
    constructor(config: JawaliConfig);
    private generateCorrID;
    private generateClientDate;
    private generateRefIdSimple;
    private setInitAttributes;
    private setAuthAttributes;
    private setWalletLoginAttributes;
    private setWalletAuthAttributes;
    private setServiceScope;
    private setServiceDomain;
    private setSignonDetail;
    private setAuthorization;
    private setRefId;
    login(): Promise<JawaliLoginResponse | JawaliErrorResponse>;
    walletAuth(): Promise<JawaliWalletAuthResponse | JawaliErrorResponse>;
    ecommerceInquiry(voucher: string, receiverMobile: string, purpose?: string): Promise<JawaliEcommerceInquiryResponse | JawaliErrorResponse>;
    ecommcaShout(voucher: string, receiverMobile: string, purpose?: string): Promise<JawaliEcommcaShoutResponse | JawaliErrorResponse>;
    private sendRequest;
    private refreshTokens;
}
export default JawaliGateway;
//# sourceMappingURL=gateway.d.ts.map