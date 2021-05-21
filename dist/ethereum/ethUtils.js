"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Web3 = require("web3");
const ethereumJsUtil = require("ethereumjs-util");
const web3utils = new Web3();
/**
 * Some utility functions to work with Ethereum dapps.
 * It also provides a reference to the [ethereumjs-util lib]{@link https://github.com/ethereumjs/ethereumjs-util}
 * @namespace
 */
exports.ethUtils = {
    /**
     * Converts a given number into a BigNumber instance. Check {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3tobignumber} for more info.
     */
    toBigNumber: web3utils.toBigNumber,
    /**
     * Converts a number of wei into the desired unit
     * @param  {number|BigNumber} amount - Amount to parse
     * @param  {string} [unit=ether]     - Which unit to use. {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3fromwei} for more info
     * @return {string} - Parsed result
     */
    fromWei(amount, unit = 'ether') {
        amount = web3utils.toBigNumber(amount);
        return web3utils.fromWei(amount, unit).toNumber(10);
    },
    /**
     * Converts an ethereum unit into wei
     * @param  {number|BigNumber} amount - Amount to convert
     * @param  {string} [unit=ether]     - Which unit to use. {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3towei} for more info
     * @return {string} - Parsed result
     */
    toWei(amount, unit = 'ether') {
        amount = web3utils.toBigNumber(amount);
        return web3utils.toWei(amount, unit).toNumber(10);
    },
    toHex(utf8) {
        return web3utils.toHex(utf8);
    },
    fromHex(hex) {
        return web3utils.toUtf8(hex);
    },
    /**
     * Checks if the address is a valid. Accepts checksummed addresses too
     * @param  {string}  address
     * @return {boolean}
     */
    isValidAddress(address) {
        return ethereumJsUtil.isValidAddress(address);
    },
    /**
     * Creates SHA-3 (Keccak) hash of the input
     * @param  {Buffer | string | number} data - The input data
     * @param  {Number} [bits] - Number the SHA-3 width. Defaults to 256
     * @return {string}      [description]
     * @deprecated use keccak
     */
    sha3(data, bits = 256) {
        return exports.ethUtils.keccak(data, bits);
    },
    /**
     * Creates Keccak-256 hash of the input
     * @param  {Buffer | string | number} data - The input data
     * @param  {Number} [bits] - Number the Keccak width. Defaults to 256
     * @return {Buffer}      [description]
     */
    keccak(data, bits = 256) {
        return ethereumJsUtil.keccak(data, bits);
    },
    /**
     * ECDSA sign some data
     * @param  {Buffer|string} data    - Data to sign. If it's a string, it'll be converted to a Buffer using sha3
     * @param  {Buffer|string} privKey - private key to sign with. If it's a string, it'll converted to an hex Buffer
     * @return {string} vrs sign result concatenated as a string
     */
    localSign(data, privKey) {
        if (typeof data === 'string')
            data = ethereumJsUtil.keccak(data);
        if (typeof privKey === 'string')
            privKey = new Buffer(privKey, 'hex');
        const vrs = ethereumJsUtil.ecsign(data, privKey);
        return `${vrs.r.toString('hex')}||${vrs.s.toString('hex')}||${vrs.v}`;
    },
    /**
     * ECDSA public key recovery from signature
     * @param  {Buffer|string} data  - Signed data. If it's a string, it'll be converted to a Buffer using sha3
     * @param  {string} signature    - The result of calling `localSign`. Concatenated string of vrs sign
     * @return {string} public key hex value
     */
    localRecover(data, signature) {
        if (typeof data === 'string') {
            data = ethereumJsUtil.keccak(data);
        }
        let [r, s, v] = signature.split('||');
        const bufferR = Buffer.from(r, 'hex');
        const bufferS = Buffer.from(s, 'hex');
        const bufferV = parseInt(v, 10);
        const publicKey = ethereumJsUtil.ecrecover(data, bufferV, bufferR, bufferS);
        return publicKey.toString('hex');
    },
    /**
     * Returns the ethereum public key of a given private key
     * @param  {Buffer|string} privKey - private key from where to derive the public key
     * @return {string} Hex public key
     */
    privateToPublicHex(privKey) {
        if (typeof privKey === 'string')
            privKey = new Buffer(privKey, 'hex');
        return ethereumJsUtil.privateToPublic(privKey).toString('hex');
    },
    /**
     * Returns the ethereum address for a given public key
     * @param  {string} pubKey - public key from where to derive the address
     * @return {string} Hex address
     */
    pubToAddressHex(pubkey) {
        if (typeof pubkey === 'string')
            pubkey = new Buffer(pubkey, 'hex');
        return ethereumJsUtil.pubToAddress(pubkey).toString('hex');
    },
    /**
     * Converts a HEX string to its number representation.
     * @param  {string} hexString - An HEX string to be converted to a number.
     * @return {number} The number representing the data hexString.
     */
    toDecimal(hexString) {
        return web3utils.toDecimal(hexString);
    },
    /**
     * Converts any ASCII string to a HEX string.
     * @param  {string} val - An ASCII string to be converted to HEX.
     * @param {number} (optional) padding - The number of bytes the returned HEX string should have.
     * @return {string} The converted HEX string.
     */
    fromAscii(val, padding) {
        return web3utils.fromAscii(val, padding);
    }
};
//# sourceMappingURL=ethUtils.js.map