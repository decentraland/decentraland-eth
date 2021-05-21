/// <reference types="node" />
import { Contract } from './Contract';
import { Wallet, TransactionStatus } from './wallets/Wallet';
export declare type ConnectOptions = {
    /** An array of objects defining contracts or Contract subclasses to use. Check {@link eth#setContracts} */
    contracts?: any[];
    /** An array of Wallet classes. Check {@link wallets} */
    wallets?: Wallet[];
    /** A provider given by other library/plugin or an URL for a provider forwarded to {@link Wallet#getWeb3Provider} */
    provider?: object | string;
};
export declare type Network = {
    id: string;
    name: string;
    label: string;
};
export declare namespace eth {
    /**
     * Filled on .connect()
     */
    let contracts: {};
    let wallet: Wallet;
    /**
     * Reference to the utilities object {@link ethUtils}
     */
    const utils: {
        toBigNumber: any;
        fromWei(amount: any, unit?: string): number;
        toWei(amount: number, unit?: string): number;
        toHex(utf8: string): string;
        fromHex(hex: any): string;
        isValidAddress(address: string): boolean;
        sha3(data: string | number | Buffer, bits?: number): Buffer;
        keccak(data: string | number | Buffer, bits?: number): Buffer;
        localSign(data: string | Buffer, privKey: string | Buffer): string;
        localRecover(data: string | Buffer, signature: string): any;
        privateToPublicHex(privKey: string | Buffer): any; /**
         * Get a contract instance built on {@link eth#setContracts}
         * It'll throw if the contract is not found on the `contracts` mapping
         * @param  {string} name - Contract name
         * @return {object} contract
         */
        pubToAddressHex(pubkey: string | Buffer): any;
        toDecimal(hexString: string): any;
        fromAscii(val: string, padding: Number): any;
    };
    /**
     * Connect to web3
     * @param  {object} [options] - Options for the ETH connection
     * @param  {array<Contract>} [options.contracts=[NodeWallet]] - An array of objects defining contracts Defaults to a NodeWallet instance. Check {@link eth#setContracts}
     * @param  {array<Wallet>} [options.wallets=[]] - An array of Wallet instances. It'll use the first successful connection. Check {@link wallets}
     * @param  {string} [options.provider = ''] - A provider given by other library/plugin or an URL for a provider forwarded to {@link Wallet#getWeb3Provider}
     * @return {boolean} - True if the connection was successful
     */
    function connect(options?: ConnectOptions): Promise<boolean>;
    function connectWallet(wallets: Wallet[], provider: object | string): Promise<Wallet>;
    function isConnected(): boolean;
    function disconnect(): void;
    function getAddress(): string;
    function getCurrentNonce(): Promise<number>;
    function getAccount(): string;
    /**
     * Set the Ethereum contracts to use on the `contracts` property. It builds a map of
     *   { [Contract Name]: Contract instance }
     * usable later via `.getContract`. Check {@link https://github.com/decentraland/decentraland-eth/tree/master/src/ethereum} for more info
     * @param  {array<Contract|object>} contracts - An array comprised Contract instances.
     */
    function setContracts(_contracts: Contract[]): Promise<void>;
    /**
     * Get a contract instance built on {@link eth#setContracts}
     * It'll throw if the contract is not found on the `contracts` mapping
     * @param  {string} name - Contract name
     * @return {object} contract
     */
    function getContract(name: string): any;
    function sign(payload: any): Promise<{
        message: string;
        signature: string;
    }>;
    function recover(message: string, signature: string): Promise<string>;
    /**
     * Get a list of known networks
     * @return {array} - An array of objects describing each network: { id, name, label }
     */
    function getNetworks(): Array<Network>;
    /**
     * Interface for the web3 `getNetwork` method (it adds the network name and label).
     * @return {object} - An object describing the current network: { id, name, label }
     */
    function getNetwork(): Promise<Network>;
    /**
     * Interface for the web3 `getBlockNumber` method.
     * @return {number} - The number of the latest block
     */
    function getBlockNumber(): Promise<number>;
    /**
     * Interface for the web3 `getBlock` method.
     * @return {object} - An ehtereum block
     */
    function getBlock(blockHashOrBlockNumber: string | number, returnTransactionObjects?: boolean): Promise<any>;
    /**
     * A helper method to get all the transactions from/to a particular address or * (between start/end block numbers)
     * @return {array} - An array of transactions
     */
    function getTransactionsByAccount(address: string, startBlockNumber?: number, endBlockNumber?: number): Promise<TransactionStatus[]>;
}
