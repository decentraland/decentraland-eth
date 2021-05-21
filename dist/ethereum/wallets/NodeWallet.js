"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Web3 = require("web3");
const Wallet_1 = require("./Wallet");
const Contract_1 = require("../Contract");
class NodeWallet extends Wallet_1.Wallet {
    getType() {
        return 'node';
    }
    async connect(provider) {
        const theProvider = typeof provider === 'object' ? provider : await this.getProvider(provider);
        if (!theProvider) {
            throw new Error('Could not get a valid provider for web3');
        }
        this.web3 = new Web3(theProvider);
        const accounts = await this.getAccounts();
        if (accounts.length !== 0) {
            this.setAccount(accounts[0]);
        }
    }
    /**
     * It'll fetch the provider from the `window` object or default to a new HttpProvider instance
     * @param  {string} [providerURL="http://localhost:8545"] - URL for an HTTP provider in case the browser provider is not present
     * @return {object} The web3 provider
     */
    getProvider(providerUrl = 'http://localhost:8545') {
        if (typeof window !== 'undefined' && window.web3 && window.web3.currentProvider) {
            return window.web3.currentProvider;
        }
        else {
            return new Web3.providers.HttpProvider(providerUrl);
        }
    }
    async getAccounts() {
        return Contract_1.Contract.sendTransaction(this.web3.eth.getAccounts);
    }
    async sign(message) {
        const account = this.getAccount();
        const sign = this.web3.personal.sign.bind(this.web3.personal);
        return Contract_1.Contract.sendTransaction(sign, message, account);
    }
    async recover(message, signature) {
        const recover = this.web3.personal.ecRecover.bind(this.web3.personal);
        return Contract_1.Contract.sendTransaction(recover, message, signature);
    }
}
exports.NodeWallet = NodeWallet;
//# sourceMappingURL=NodeWallet.js.map