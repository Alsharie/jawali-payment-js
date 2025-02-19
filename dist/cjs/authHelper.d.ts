declare class AuthHelper {
    private authSessionName;
    private walletSessionName;
    constructor();
    setAuthToken(token: string): void;
    getAuthToken(): string | null;
    setWalletToken(token: string): void;
    getWalletToken(): string | null;
}
export default AuthHelper;
//# sourceMappingURL=authHelper.d.ts.map