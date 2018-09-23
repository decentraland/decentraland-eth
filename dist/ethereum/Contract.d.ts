/** Class to work with Ethereum contracts */
export declare abstract class Contract<T = any> {
    instance: T;
    abi: any;
    address: string;
    /**
     * @param  {string} [address] - Address of the contract. If it's undefined, it'll use the result of calling {@link Contract#getDefaultAddress}
     * @param  {object} [abi]     - Object describing the contract (compile result). If it's undefined, it'll use the result of calling {@link Contract#getDefaultAbi}
     */
    constructor(address: string, abi: object);
    /**
     * Checks if an address is actually 0 in hex or a falsy value
     * @param  {string} address
     * @return {boolean}
     */
    static isEmptyAddress(address: string): boolean;
    /**
     * See {@link Contract#sendTransaction}
     */
    static sendTransaction(method: Function, ...args: any[]): Promise<any>;
    /**
     * See {@link Contract#sendCall}
     */
    static sendCall(prop: any, ...args: any[]): Promise<any>;
    /**
     * Get the contract name
     * @return {string} - contract name
     */
    abstract getContractName(): string;
    /**
     * Get the contract events from the abi
     * @return {Array<string>} - events
     */
    getEvents(): Array<string>;
    /**
     * Set's the address of the contract. It'll throw on falsy values
     * @param {string} address - Address of the contract
     */
    setAddress(address: string): void;
    /**
     * Set's the abi of the contract. It'll throw on falsy values
     * @param {object} abi - Abi of the contract
     */
    setAbi(abi: any): void;
    setInstance(instance: any): void;
    /**
     * Execute a write-operation, and broadcast it to be processed by miners and published on the blockchain.
     * @param  {string}    method - Method name
     * @param  {...object} args   - Every argument after the name will be fordwarded to the transaction method, in order
     * @return {Promise} - promise that resolves when the transaction does
     */
    sendTransaction(method: string, ...args: any[]): Promise<any>;
    /**
     * Inoke a contract function that does not broadcast or publish anything on the blockchain.
     * @param  {string}    prop - Prop name
     * @param  {...object} args   - Every argument after the name will be fordwarded to the call function, in order
     * @return {Promise} - promise that resolves when the call does
     */
    sendCall(prop: string, ...args: any[]): Promise<any>;
    getEvent(eventName: any): any;
}
