class InMemoryStore {
    constructor() {
        this.store = {};
    }
    setItem(key, value) {
        this.store[key] = value;
    }
    getItem(key) {
        return this.store[key] || null;
    }
    removeItem(key) {
        delete this.store[key];
    }
}
const inMemoryStore = new InMemoryStore();
class AuthHelper {
    constructor() {
        this.authSessionName = 'LOGIN_ACCESS_TOKEN';
        this.walletSessionName = 'WALLET_ACCESS_TOKEN';
    }
    setAuthToken(token) {
        inMemoryStore.setItem(this.authSessionName, token);
    }
    getAuthToken() {
        return inMemoryStore.getItem(this.authSessionName);
    }
    setWalletToken(token) {
        inMemoryStore.setItem(this.walletSessionName, token);
    }
    getWalletToken() {
        return inMemoryStore.getItem(this.walletSessionName);
    }
}
export default AuthHelper;
