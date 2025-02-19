class InMemoryStore {
    private store: { [key: string]: string } = {};

    setItem(key: string, value: string) {
        this.store[key] = value;
    }

    getItem(key: string): string | null {
        return this.store[key] || null;
    }

    removeItem(key: string) {
        delete this.store[key];
    }
}

const inMemoryStore = new InMemoryStore();


class AuthHelper {

    private authSessionName: string;
    private walletSessionName: string;

    constructor() {
        this.authSessionName = 'LOGIN_ACCESS_TOKEN';
        this.walletSessionName = 'WALLET_ACCESS_TOKEN';
    }

    setAuthToken(token: string) {
        inMemoryStore.setItem(this.authSessionName, token);
    }

    getAuthToken() {
        return inMemoryStore.getItem(this.authSessionName);
    }

    setWalletToken(token: string) {
        inMemoryStore.setItem(this.walletSessionName, token);
    }

    getWalletToken() {
        return inMemoryStore.getItem(this.walletSessionName);
    }
}

export default AuthHelper;