"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Web3 = require("web3");
const hw_transport_u2f_1 = require("@ledgerhq/hw-transport-u2f");
const hw_app_eth_1 = require("@ledgerhq/hw-app-eth");
const web3_subprovider_1 = require("@ledgerhq/web3-subprovider");
const ProviderEngine = require("web3-provider-engine");
const RpcSubprovider = require("web3-provider-engine/subproviders/rpc");
const Wallet_1 = require("./Wallet");
const utils_1 = require("../../utils");
class LedgerWallet extends Wallet_1.Wallet {
    constructor(account, derivationPath) {
        super(account);
        this.ledger = null;
        this.engine = null;
        this.derivationPath = "44'/60'/0'/0";
        this.derivationPath = derivationPath || "44'/60'/0'/0";
    }
    static async isSupported() {
        const devices = await hw_transport_u2f_1.default.list();
        return devices.length > 0;
    }
    getType() {
        return 'ledger';
    }
    async connect(providerUrl, networkId) {
        if (typeof providerUrl === 'object') {
            throw new Error('Ledger wallet only allows string providers');
        }
        if (!providerUrl || !networkId) {
            throw new Error('You must provide both providerUrl and networkId');
        }
        const transport = await hw_transport_u2f_1.default.open(null, 2);
        this.ledger = new hw_app_eth_1.default(transport);
        this.engine = new ProviderEngine();
        const provider = await this.getProvider(providerUrl, networkId);
        this.web3 = new Web3(provider);
        try {
            // FireFox hangs on indefinetly on `getAccounts`, so the second promise acts as a timeout
            const accounts = await Promise.race([
                this.getAccounts(),
                utils_1.sleep(2000).then(() => Promise.reject({ message: 'Timed out trying to connect to ledger' }))
            ]);
            if (accounts[0]) {
                this.setAccount(accounts[0]);
            }
        }
        catch (_a) {
            // do nothing
        }
    }
    disconnect() {
        super.disconnect();
        if (this.engine) {
            this.engine.stop();
            this.engine = null;
        }
    }
    /**
     * It'll create a new provider using the providerUrl param for RPC calls
     * @param  {string} [providerURL="https://mainnet.infura.io/"] - URL for an HTTP provider
     * @param  {string} [networkId="1"] - The id of the network we're connecting to. 1 means mainnet, check {@link eth#getNetworks}
     * @return {object} The web3 provider
     */
    async getProvider(providerUrl = 'https://mainnet.infura.io/', networkId = '1') {
        let ledgerWalletSubProvider = web3_subprovider_1.default(() => hw_transport_u2f_1.default.create(), { networkId, path: this.derivationPath });
        this.engine.addProvider(ledgerWalletSubProvider);
        this.engine.addProvider(new RpcSubprovider({
            rpcUrl: providerUrl
        }));
        this.engine.start();
        return this.engine;
    }
    async getAccounts() {
        const defaultAccount = await this.ledger.getAddress(this.derivationPath);
        return [defaultAccount.address]; // follow the Wallet interface
    }
    async sign(message) {
        let { v, r, s } = await this.ledger.signPersonalMessage(this.derivationPath, message.substring(2));
        v = (v - 27).toString(16);
        if (v.length < 2)
            v = '0' + v;
        return '0x' + r + s + v;
    }
}
exports.LedgerWallet = LedgerWallet;
//# sourceMappingURL=LedgerWallet.js.map