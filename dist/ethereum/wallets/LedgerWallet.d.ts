import { Wallet } from './Wallet';
export declare class LedgerWallet extends Wallet {
    ledger: any;
    engine: any;
    derivationPath: string;
    constructor(account: string, derivationPath: string);
    static isSupported(): Promise<boolean>;
    getType(): string;
    connect(providerUrl: object | string, networkId?: string): Promise<void>;
    disconnect(): void;
    /**
     * It'll create a new provider using the providerUrl param for RPC calls
     * @param  {string} [providerURL="https://mainnet.infura.io/"] - URL for an HTTP provider
     * @param  {string} [networkId="1"] - The id of the network we're connecting to. 1 means mainnet, check {@link eth#getNetworks}
     * @return {object} The web3 provider
     */
    getProvider(providerUrl?: string, networkId?: string): Promise<any>;
    getAccounts(): Promise<any[]>;
    sign(message: string): Promise<string>;
}
