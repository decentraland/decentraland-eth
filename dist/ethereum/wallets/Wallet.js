"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const Abi_1 = require("../abi/Abi");
// Interface
class Wallet {
    constructor(account) {
        this.account = account;
        this.type = this.getType();
        this.web3 = null;
        this.derivationPath = null;
        // stub
    }
    isConnected() {
        return this.web3 && !!this.web3.eth;
    }
    getWeb3() {
        return this.web3;
    }
    getAccount() {
        if (!this.account) {
            throw new Error("The current wallet/provider doesn't have any linked account");
        }
        return this.account;
    }
    setAccount(account) {
        if (this.web3 && this.web3.eth) {
            this.web3.eth.defaultAccount = account;
        }
        this.account = account;
    }
    /**
     * Connects the wallet
     * @param provider Receives the provider URL or the provider object from i.e. metamask
     */
    async connect(provider, networkId) {
        throw new Error('Not implemented. Check wallet support');
    }
    disconnect() {
        this.web3 = null;
        this.setAccount(null);
    }
    /**
     * Gets the appropiate Web3 provider for the given environment.
     * Check each implementation for in detail information
     * @param  {string} [providerURL] - URL for a provider.
     * @return {object} The web3 provider
     */
    async getProvider(providerUrl) {
        throw new Error('Not implemented. Check wallet support');
    }
    /**
     * Return available accounts for the current wallet
     * @return {Promise<array<string>>} accounts
     */
    async getAccounts() {
        throw new Error('Not implemented. Check wallet support');
    }
    /**
     * Returns the balance of the account
     * @return {Promise<any>} accounts
     */
    async getBalance(coinbase) {
        return utils_1.promisify(this.getWeb3().eth.getBalance)(coinbase);
    }
    async getCoinbase() {
        return utils_1.promisify(this.getWeb3().eth.getCoinbase)();
    }
    async estimateGas(options) {
        return utils_1.promisify(this.getWeb3().eth.estimateGas)(options);
    }
    async sendTransaction(transactionObject) {
        return utils_1.promisify(this.getWeb3().eth.sendTransaction)(transactionObject);
    }
    async getContract(abi) {
        return this.getWeb3().eth.contract(abi);
    }
    /**
     * Interface for the web3 `getTransaction` method
     * @param  {string} txId - Transaction id/hash
     * @return {object}      - An object describing the transaction (if it exists)
     */
    async getTransactionStatus(txId) {
        return utils_1.promisify(this.getWeb3().eth.getTransaction)(txId);
    }
    /**
     * Interface for the web3 `getTransactionReceipt` method. It adds the decoded logs to the result (if any)
     * @param  {string} txId - Transaction id/hash
     * @return {object} - An object describing the transaction receipt (if it exists) with it's logs
     */
    async getTransactionReceipt(txId) {
        const receipt = await utils_1.promisify(this.getWeb3().eth.getTransactionReceipt)(txId);
        if (receipt && receipt.logs) {
            receipt.logs = Abi_1.Abi.decodeLogs(receipt.logs);
        }
        return receipt;
    }
    /**
     * Creates a new contract instance with all its methods and events defined in its json interface object (abi).
     * @param  {object} abi     - Application Binary Interface.
     * @param  {string} address - Contract address
     * @return {object} instance
     */
    async createContractInstance(abi, address) {
        const contract = await this.getContract(abi);
        return contract.at(address);
    }
    /**
     * Unlocks the current account with the given password
     * @param  {string} password - Account password
     * @return {boolean} Whether the operation was successfull or not
     */
    async unlockAccount(password) {
        return utils_1.promisify(this.web3.personal.unlockAccount)(this.getAccount(), password);
    }
    /**
     * Signs data from the default account
     * @param  {string} message - Message to sign, ussually in Hex
     * @return {Promise<string>} signature
     */
    async sign(message) {
        throw new Error('Not implemented. Check wallet support');
    }
    /**
     * Recovers the account that signed the data
     * @param  {string} message   - Data that was signed
     * @param  {string} signature
     * @return {Promise<string>} account
     */
    async recover(message, signature) {
        throw new Error('Not implemented. Check wallet support');
    }
}
exports.Wallet = Wallet;
//# sourceMappingURL=Wallet.js.map