/// <reference types="node" />
/**
 * Some utility functions to work with Ethereum dapps.
 * It also provides a reference to the [ethereumjs-util lib]{@link https://github.com/ethereumjs/ethereumjs-util}
 * @namespace
 */
export declare const ethUtils: {
    /**
     * Converts a given number into a BigNumber instance. Check {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3tobignumber} for more info.
     */
    toBigNumber: any;
    /**
     * Converts a number of wei into the desired unit
     * @param  {number|BigNumber} amount - Amount to parse
     * @param  {string} [unit=ether]     - Which unit to use. {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3fromwei} for more info
     * @return {string} - Parsed result
     */
    fromWei(amount: any, unit?: string): number;
    /**
     * Converts an ethereum unit into wei
     * @param  {number|BigNumber} amount - Amount to convert
     * @param  {string} [unit=ether]     - Which unit to use. {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3towei} for more info
     * @return {string} - Parsed result
     */
    toWei(amount: number, unit?: string): number;
    toHex(utf8: string): string;
    fromHex(hex: any): string;
    /**
     * Checks if the address is a valid. Accepts checksummed addresses too
     * @param  {string}  address
     * @return {boolean}
     */
    isValidAddress(address: string): boolean;
    /**
     * Creates SHA-3 (Keccak) hash of the input
     * @param  {Buffer | string | number} data - The input data
     * @param  {Number} [bits] - Number the SHA-3 width. Defaults to 256
     * @return {string}      [description]
     */
    sha3(data: string | number | Buffer, bits?: Number): Buffer;
    /**
     * Creates Keccak-256 hash of the input
     * @param  {Buffer | string | number} data - The input data
     * @param  {Number} [bits] - Number the Keccak width. Defaults to 256
     * @return {Buffer}      [description]
     */
    keccak(data: string | number | Buffer, bits?: Number): Buffer;
    /**
     * ECDSA sign some data
     * @param  {Buffer|string} data    - Data to sign. If it's a string, it'll be converted to a Buffer using sha3
     * @param  {Buffer|string} privKey - private key to sign with. If it's a string, it'll converted to an hex Buffer
     * @return {string} vrs sign result concatenated as a string
     */
    localSign(data: string | Buffer, privKey: string | Buffer): string;
    /**
     * ECDSA public key recovery from signature
     * @param  {Buffer|string} data  - Signed data. If it's a string, it'll be converted to a Buffer using sha3
     * @param  {string} signature    - The result of calling `localSign`. Concatenated string of vrs sign
     * @return {string} public key hex value
     */
    localRecover(data: string | Buffer, signature: string): any;
    /**
     * Returns the ethereum public key of a given private key
     * @param  {Buffer|string} privKey - private key from where to derive the public key
     * @return {string} Hex public key
     */
    privateToPublicHex(privKey: string | Buffer): any;
    /**
     * Returns the ethereum address for a given public key
     * @param  {string} pubKey - public key from where to derive the address
     * @return {string} Hex address
     */
    pubToAddressHex(pubkey: string): any;
    /**
     * Converts a HEX string to its number representation.
     * @param  {string} hexString - An HEX string to be converted to a number.
     * @return {number} The number representing the data hexString.
     */
    toDecimal(hexString: string): any;
    /**
     * Converts any ASCII string to a HEX string.
     * @param  {string} val - An ASCII string to be converted to HEX.
     * @param {number} (optional) padding - The number of bytes the returned HEX string should have.
     * @return {string} The converted HEX string.
     */
    fromAscii(val: string, padding: Number): any;
};
