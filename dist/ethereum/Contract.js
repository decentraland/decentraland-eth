"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const abi_1 = require("./abi");
const Event_1 = require("./Event");
const verification_1 = require("../contracts/verification");
/** Class to work with Ethereum contracts */
class Contract {
    /**
     * @param  {string} [address] - Address of the contract. If it's undefined, it'll use the result of calling {@link Contract#getDefaultAddress}
     * @param  {object} [abi]     - Object describing the contract (compile result). If it's undefined, it'll use the result of calling {@link Contract#getDefaultAbi}
     */
    constructor(address, abi) {
        this.setAddress(address);
        const sanitizedABI = abi_1.Abi.sanitize(abi);
        this.setAbi(sanitizedABI);
        verification_1.fulfillContractMethods(this, sanitizedABI);
        this.instance = null;
    }
    /**
     * Checks if an address is actually 0 in hex or a falsy value
     * @param  {string} address
     * @return {boolean}
     */
    static isEmptyAddress(address) {
        return !address || address === '0x0000000000000000000000000000000000000000' || address === '0x';
    }
    /**
     * See {@link Contract#sendTransaction}
     */
    static async sendTransaction(method, ...args) {
        return utils_1.promisify(method)(...args);
    }
    /**
     * See {@link Contract#sendCall}
     */
    static async sendCall(prop, ...args) {
        return utils_1.promisify(prop.call)(...args);
    }
    /**
     * Get the contract events from the abi
     * @return {Array<string>} - events
     */
    getEvents() {
        return abi_1.Abi.new(this.abi).getEvents();
    }
    /**
     * Set's the address of the contract. It'll throw on falsy values
     * @param {string} address - Address of the contract
     */
    setAddress(address) {
        if (!address) {
            throw new Error('Tried to instantiate a Contract without an `address`');
        }
        this.address = address;
    }
    /**
     * Set's the abi of the contract. It'll throw on falsy values
     * @param {object} abi - Abi of the contract
     */
    setAbi(abi) {
        if (!abi) {
            throw new Error('Tried to instantiate a Contract without an `abi`');
        }
        this.abi = abi_1.Abi.new(abi);
    }
    setInstance(instance) {
        this.instance = instance;
    }
    /**
     * Execute a write-operation, and broadcast it to be processed by miners and published on the blockchain.
     * @param  {string} method - Method name
     * @param  {string} args - Args of the method type name. E.g: address,address,uint256
     * @param  {...object} params   - Every argument after the name will be fordwarded to the call function, in order
     * @return {Promise} - promise that resolves when the transaction does
     */
    sendTransactionByType(method, args, ...params) {
        const fn = this.instance[method][args];
        return this._sendTransaction(fn, method, ...params);
    }
    /**
     * Execute a write-operation, and broadcast it to be processed by miners and published on the blockchain.
     * @param  {string} method - Method name
     * @param  {...object} params   - Every argument after the name will be fordwarded to the call function, in order
     * @return {Promise} - promise that resolves when the transaction does
     */
    sendTransaction(method, ...params) {
        const fn = this.instance[method];
        return this._sendTransaction(fn, method, ...params);
    }
    /**
     * Inoke a contract function that does not broadcast or publish anything on the blockchain.
     * @param  {string} method - Method name
     * @param  {string} args - Args of the method type name. E.g: address,address,uint256
     * @param  {...object} params   - Every argument after the name will be fordwarded to the call function, in order
     * @return {Promise} - promise that resolves when the call does
     */
    sendCallByType(method, args, ...params) {
        const fn = this.instance[method][args];
        return this._sendCall(fn, method, ...params);
    }
    /**
     * Inoke a contract function that does not broadcast or publish anything on the blockchain.
     * @param  {string} method - Method name
     * @param  {...object} params   - Every argument after the name will be fordwarded to the call function, in order
     * @return {Promise} - promise that resolves when the call does
     */
    sendCall(method, ...params) {
        const fn = this.instance[method];
        return this._sendCall(fn, method, ...params);
    }
    /**
     * Inoke a contract function that does not broadcast or publish anything on the blockchain.
     * @param  {function} fn - Method function
     * @param  {string} method - Method name
     * @param  {...object} params - Every argument after the name will be fordwarded to the call function, in order
     * @return {Promise} - promise that resolves when the call does
     */
    _sendTransaction(fn, method, ...params) {
        if (!this.instance) {
            throw new Error(`The contract "${this.getContractName()}" was not initialized with a provider`);
        }
        if (!fn) {
            throw new Error(`${this.getContractName()}#sendTransaction: Unknown method ${method}`);
        }
        if (typeof fn !== 'function') {
            throw new Error(`${this.getContractName()}#sendTransaction: method ${method} is not a function`);
        }
        return Contract.sendTransaction(fn, ...params);
    }
    /**
     * Inoke a contract function that does not broadcast or publish anything on the blockchain.
     * @param  {function} fn - Method function
     * @param  {string} method - Method name
     * @param  {...object} params   - Every argument after the name will be fordwarded to the call function, in order
     * @return {Promise} - promise that resolves when the call does
     */
    _sendCall(fn, method, ...params) {
        if (!this.instance) {
            throw new Error(`The contract "${this.getContractName()}" was not initialized with a provider`);
        }
        if (!fn) {
            throw new Error(`${this.getContractName()}#sendCall: Unknown method ${method}`);
        }
        if (!fn.call) {
            throw new Error(`${this.getContractName()}#sendCall: property ${method} has no call signature`);
        }
        return Contract.sendCall(fn, ...params);
    }
    getEvent(eventName) {
        return new Event_1.Event(this, eventName);
    }
}
exports.Contract = Contract;
//# sourceMappingURL=Contract.js.map