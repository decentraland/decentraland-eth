import { BigNumber } from 'bignumber.js';
export interface TransactionReceipt {
    transactionHash: string;
    transactionIndex: number;
    blockHash: string;
    blockNumber: number;
    gasUsed: number;
    cumulativeGasUsed: number;
    contractAddress: string;
    logs: any[];
    status: string;
    logsBloom: string;
}
export declare type TransactionStatus = {
    hash: string;
    nonce: number;
    blockHash: string;
    blockNumber: number | null;
    transactionIndex: number;
    from: string;
    to: string;
    value: any;
    gas: number;
    gasPrice: any;
    input: string;
};
export declare abstract class Wallet {
    private account?;
    type: string;
    web3: any;
    derivationPath: any;
    constructor(account?: string);
    abstract getType(): string;
    isConnected(): boolean;
    getWeb3(): any;
    getAccount(): string;
    setAccount(account: string): void;
    /**
     * Connects the wallet
     * @param provider Receives the provider URL or the provider object from i.e. metamask
     */
    connect(provider: string | object, networkId?: string): Promise<void>;
    disconnect(): void;
    /**
     * Gets the appropiate Web3 provider for the given environment.
     * Check each implementation for in detail information
     * @param  {string} [providerURL] - URL for a provider.
     * @return {object} The web3 provider
     */
    getProvider(providerUrl: string): Promise<any>;
    /**
     * Return available accounts for the current wallet
     * @return {Promise<array<string>>} accounts
     */
    getAccounts(): Promise<any[]>;
    /**
     * Returns the balance of the account
     * @return {Promise<any>} accounts
     */
    getBalance(coinbase: string): Promise<BigNumber>;
    getCoinbase(): Promise<string>;
    estimateGas(options: {
        data: string;
        to?: string;
    }): Promise<any>;
    sendTransaction(transactionObject: any): Promise<any>;
    getContract(abi: any[]): Promise<any>;
    /**
     * Interface for the web3 `getTransaction` method
     * @param  {string} txId - Transaction id/hash
     * @return {object}      - An object describing the transaction (if it exists)
     */
    getTransactionStatus(txId: string): Promise<TransactionStatus>;
    /**
     * Interface for the web3 `getTransactionReceipt` method. It adds the decoded logs to the result (if any)
     * @param  {string} txId - Transaction id/hash
     * @return {object} - An object describing the transaction receipt (if it exists) with it's logs
     */
    getTransactionReceipt(txId: string): Promise<TransactionReceipt>;
    /**
     * Creates a new contract instance with all its methods and events defined in its json interface object (abi).
     * @param  {object} abi     - Application Binary Interface.
     * @param  {string} address - Contract address
     * @return {object} instance
     */
    createContractInstance(abi: any[], address: string): Promise<any>;
    /**
     * Unlocks the current account with the given password
     * @param  {string} password - Account password
     * @return {boolean} Whether the operation was successfull or not
     */
    unlockAccount(password: string): Promise<any>;
    /**
     * Signs data from the default account
     * @param  {string} message - Message to sign, ussually in Hex
     * @return {Promise<string>} signature
     */
    sign(message: string): Promise<string>;
    /**
     * Recovers the account that signed the data
     * @param  {string} message   - Data that was signed
     * @param  {string} signature
     * @return {Promise<string>} account
     */
    recover(message: string, signature: string): Promise<string>;
}
