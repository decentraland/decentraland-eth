"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const abi_1 = require("./abi");
const Event_1 = require("./Event");
/** Class to work with Ethereum contracts */
class Contract {
    /**
     * @param  {string} [address] - Address of the contract. If it's undefined, it'll use the result of calling {@link Contract#getDefaultAddress}
     * @param  {object} [abi]     - Object describing the contract (compile result). If it's undefined, it'll use the result of calling {@link Contract#getDefaultAbi}
     */
    constructor(address, abi) {
        this.setAddress(address);
        this.setAbi(abi);
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
     * @param  {string}    method - Method name
     * @param  {...object} args   - Every argument after the name will be fordwarded to the transaction method, in order
     * @return {Promise} - promise that resolves when the transaction does
     */
    sendTransaction(method, ...args) {
        if (!this.instance) {
            throw new Error(`The contract "${this.getContractName()}" was not initialized with a provider`);
        }
        if (!this.instance[method]) {
            throw new Error(`${this.getContractName()}#sendTransaction: Unknown method ${method}`);
        }
        if (typeof this.instance[method] !== 'function') {
            throw new Error(`${this.getContractName()}#sendTransaction: method ${method} is not a function`);
        }
        return Contract.sendTransaction(this.instance[method], ...args);
    }
    /**
     * Inoke a contract function that does not broadcast or publish anything on the blockchain.
     * @param  {string}    prop - Prop name
     * @param  {...object} args   - Every argument after the name will be fordwarded to the call function, in order
     * @return {Promise} - promise that resolves when the call does
     */
    sendCall(prop, ...args) {
        if (!this.instance) {
            throw new Error(`The contract "${this.getContractName()}" was not initialized with a provider`);
        }
        if (!this.instance[prop]) {
            throw new Error(`${this.getContractName()}#sendCall: Unknown method ${prop}`);
        }
        if (!this.instance[prop].call) {
            throw new Error(`${this.getContractName()}#sendCall: property ${prop} has no call signature`);
        }
        return Contract.sendCall(this.instance[prop], ...args);
    }
    getEvent(eventName) {
        return new Event_1.Event(this, eventName);
    }
}
exports.Contract = Contract;
//# sourceMappingURL=Contract.js.map