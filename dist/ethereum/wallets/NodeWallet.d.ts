import { Wallet } from './Wallet';
export declare class NodeWallet extends Wallet {
    web3: any;
    getType(): string;
    connect(provider: object | string): Promise<void>;
    /**
     * It'll fetch the provider from the `window` object or default to a new HttpProvider instance
     * @param  {string} [providerURL="http://localhost:8545"] - URL for an HTTP provider in case the browser provider is not present
     * @return {object} The web3 provider
     */
    getProvider(providerUrl?: string): any;
    getAccounts(): Promise<any[]>;
    sign(message: string): Promise<any>;
    recover(message: string, signature: string): Promise<any>;
}
