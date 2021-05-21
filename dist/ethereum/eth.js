"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wallets_1 = require("./wallets");
const ethUtils_1 = require("./ethUtils");
const index_1 = require("../utils/index");
const Contract_1 = require("./Contract");
var eth;
(function (eth) {
    /**
     * Filled on .connect()
     */
    eth.contracts = {};
    eth.wallet = null;
    /**
     * Reference to the utilities object {@link ethUtils}
     */
    eth.utils = ethUtils_1.ethUtils;
    /**
     * Connect to web3
     * @param  {object} [options] - Options for the ETH connection
     * @param  {array<Contract>} [options.contracts=[NodeWallet]] - An array of objects defining contracts Defaults to a NodeWallet instance. Check {@link eth#setContracts}
     * @param  {array<Wallet>} [options.wallets=[]] - An array of Wallet instances. It'll use the first successful connection. Check {@link wallets}
     * @param  {string} [options.provider = ''] - A provider given by other library/plugin or an URL for a provider forwarded to {@link Wallet#getWeb3Provider}
     * @return {boolean} - True if the connection was successful
     */
    async function connect(options = {}) {
        if (isConnected()) {
            disconnect();
        }
        const { wallets = [new wallets_1.NodeWallet()], provider = '' } = options;
        try {
            eth.wallet = await connectWallet(wallets, provider);
            // connect old contracts
            await setContracts(Object.values(eth.contracts));
            // connect new contracts
            await setContracts(options.contracts || []);
            return true;
        }
        catch (error) {
            console.info(`Error trying to connect Ethereum wallet: ${error.message}`);
            return false;
        }
    }
    eth.connect = connect;
    async function connectWallet(wallets, provider) {
        const networks = getNetworks();
        const network = networks.find(network => provider.toString().includes(network.name)) || networks[0];
        const errors = [];
        for (const wallet of wallets) {
            try {
                await wallet.connect(provider, network.id);
                return wallet;
            }
            catch (error) {
                errors.push(error.message);
            }
        }
        throw new Error(errors.join('\n'));
    }
    eth.connectWallet = connectWallet;
    function isConnected() {
        return eth.wallet && eth.wallet.isConnected();
    }
    eth.isConnected = isConnected;
    function disconnect() {
        if (eth.wallet) {
            eth.wallet.disconnect();
        }
        eth.wallet = null;
        eth.contracts = {};
    }
    eth.disconnect = disconnect;
    function getAddress() {
        return getAccount();
    }
    eth.getAddress = getAddress;
    async function getCurrentNonce() {
        const address = getAddress();
        return index_1.promisify(eth.wallet.getWeb3().eth.getTransactionCount)(address);
    }
    eth.getCurrentNonce = getCurrentNonce;
    function getAccount() {
        return eth.wallet.getAccount();
    }
    eth.getAccount = getAccount;
    /**
     * Set the Ethereum contracts to use on the `contracts` property. It builds a map of
     *   { [Contract Name]: Contract instance }
     * usable later via `.getContract`. Check {@link https://github.com/decentraland/decentraland-eth/tree/master/src/ethereum} for more info
     * @param  {array<Contract|object>} contracts - An array comprised Contract instances.
     */
    async function setContracts(_contracts) {
        if (!isConnected()) {
            throw new Error('Tried to set eth contracts without connecting successfully first');
        }
        for (const contractData of _contracts) {
            let contract = null;
            let contractName = null;
            if (typeof contractData === 'object' && contractData instanceof Contract_1.Contract) {
                // contractData is an instance of Contract or of one of its subclasses
                contract = contractData;
                contractName = contract.getContractName();
            }
            else {
                console.error('The parameter is not instance of a contract', contractData);
                continue;
            }
            const instance = await eth.wallet.createContractInstance(contract.abi, contract.address);
            contract.setInstance(instance);
            eth.contracts[contractName] = contract;
        }
    }
    eth.setContracts = setContracts;
    /**
     * Get a contract instance built on {@link eth#setContracts}
     * It'll throw if the contract is not found on the `contracts` mapping
     * @param  {string} name - Contract name
     * @return {object} contract
     */
    function getContract(name) {
        if (!eth.contracts[name]) {
            const contractNames = Object.keys(eth.contracts);
            throw new Error(`The contract ${name} not found.\nDid you add it to the '.connect()' call?\nAvailable contracts are "${JSON.stringify(contractNames)}"`);
        }
        return eth.contracts[name];
    }
    eth.getContract = getContract;
    async function sign(payload) {
        const message = ethUtils_1.ethUtils.toHex(payload);
        const signature = await eth.wallet.sign(message);
        return { message, signature };
    }
    eth.sign = sign;
    async function recover(message, signature) {
        return eth.wallet.recover(message, signature);
    }
    eth.recover = recover;
    /**
     * Get a list of known networks
     * @return {array} - An array of objects describing each network: { id, name, label }
     */
    function getNetworks() {
        return [
            {
                id: '1',
                name: 'mainnet',
                label: 'Main Ethereum Network'
            },
            {
                id: '2',
                name: 'morden',
                label: 'Morden Test Network'
            },
            {
                id: '3',
                name: 'ropsten',
                label: 'Ropsten Test Network'
            },
            {
                id: '4',
                name: 'rinkeby',
                label: 'Rinkeby Test Network'
            },
            {
                id: '5',
                name: 'goerli',
                label: 'Goerli Test Network'
            },
            {
                id: '42',
                name: 'kovan',
                label: 'Kovan Test Network'
            },
            {
                id: '53611',
                name: 'TEST_RPC',
                label: 'TEST_RPC Network'
            }
        ];
    }
    eth.getNetworks = getNetworks;
    /**
     * Interface for the web3 `getNetwork` method (it adds the network name and label).
     * @return {object} - An object describing the current network: { id, name, label }
     */
    async function getNetwork() {
        const id = await index_1.promisify(eth.wallet.getWeb3().version.getNetwork)();
        const networks = getNetworks();
        const network = networks.find(network => network.id === id);
        if (!network) {
            throw new Error(`Unknown Network id: ${id}`);
        }
        return network;
    }
    eth.getNetwork = getNetwork;
    /**
     * Interface for the web3 `getBlockNumber` method.
     * @return {number} - The number of the latest block
     */
    async function getBlockNumber() {
        return index_1.promisify(eth.wallet.getWeb3().eth.getBlockNumber)();
    }
    eth.getBlockNumber = getBlockNumber;
    /**
     * Interface for the web3 `getBlock` method.
     * @return {object} - An ehtereum block
     */
    async function getBlock(blockHashOrBlockNumber, returnTransactionObjects = false) {
        return index_1.promisify(eth.wallet.getWeb3().eth.getBlock)(blockHashOrBlockNumber, returnTransactionObjects);
    }
    eth.getBlock = getBlock;
    /**
     * A helper method to get all the transactions from/to a particular address or * (between start/end block numbers)
     * @return {array} - An array of transactions
     */
    async function getTransactionsByAccount(address, startBlockNumber = null, endBlockNumber = null) {
        if (endBlockNumber == null) {
            endBlockNumber = await this.getBlockNumber();
        }
        if (startBlockNumber == null) {
            startBlockNumber = endBlockNumber - 1000;
        }
        startBlockNumber = startBlockNumber < 0 ? 0 : startBlockNumber;
        endBlockNumber = endBlockNumber < startBlockNumber ? startBlockNumber : endBlockNumber;
        const accountTransactions = [];
        for (let i = startBlockNumber; i <= endBlockNumber; i++) {
            let block = await this.getBlock(i, true);
            if (block != null && block.transactions != null) {
                block.transactions.forEach(function (tx) {
                    if (address === '*' || address === tx.from || address === tx.to) {
                        accountTransactions.push(tx);
                    }
                });
            }
        }
        return accountTransactions;
    }
    eth.getTransactionsByAccount = getTransactionsByAccount;
})(eth = exports.eth || (exports.eth = {}));
//# sourceMappingURL=eth.js.map