import Web3 = require('web3')
import ethereumJsUtil = require('ethereumjs-util')

const web3utils = new Web3()

/**
 * Some utility functions to work with Ethereum dapps.
 * It also provides a reference to the [ethereumjs-util lib]{@link https://github.com/ethereumjs/ethereumjs-util}
 * @namespace
 */
export const ethUtils = {
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
  fromWei(amount, unit = 'ether'): number {
    amount = web3utils.toBigNumber(amount)
    return web3utils.fromWei(amount, unit).toNumber(10)
  },

  /**
   * Converts an ethereum unit into wei
   * @param  {number|BigNumber} amount - Amount to convert
   * @param  {string} [unit=ether]     - Which unit to use. {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3towei} for more info
   * @return {string} - Parsed result
   */
  toWei(amount: number, unit = 'ether'): number {
    amount = web3utils.toBigNumber(amount)
    return web3utils.toWei(amount, unit).toNumber(10)
  },

  toHex(utf8: string): string {
    return web3utils.toHex(utf8)
  },

  fromHex(hex): string {
    return web3utils.toUtf8(hex)
  },

  /**
   * Checks if the address is a valid. Accepts checksummed addresses too
   * @param  {string}  address
   * @return {boolean}
   */
  isValidAddress(address: string): boolean {
    return ethereumJsUtil.isValidAddress(address)
  },

  /**
   * Creates SHA-3 (Keccak) hash of the input
   * @param  {Buffer | string | number} data - The input data
   * @param  {Number} [bits] - Number the SHA-3 width. Defaults to 256
   * @return {string}      [description]
   * @deprecated use keccak
   */
  sha3(data: Buffer | string | number, bits: number = 256): Buffer {
    return ethUtils.keccak(data, bits)
  },

  /**
   * Creates Keccak-256 hash of the input
   * @param  {Buffer | string | number} data - The input data
   * @param  {Number} [bits] - Number the Keccak width. Defaults to 256
   * @return {Buffer}      [description]
   */
  keccak(data: Buffer | string | number, bits: number = 256): Buffer {
    return ethereumJsUtil.keccak(data, bits)
  },

  /**
   * ECDSA sign some data
   * @param  {Buffer|string} data    - Data to sign. If it's a string, it'll be converted to a Buffer using sha3
   * @param  {Buffer|string} privKey - private key to sign with. If it's a string, it'll converted to an hex Buffer
   * @return {string} vrs sign result concatenated as a string
   */
  localSign(data: Buffer | string, privKey: Buffer | string) {
    if (typeof data === 'string') data = ethereumJsUtil.keccak(data)
    if (typeof privKey === 'string') privKey = new Buffer(privKey, 'hex')

    const vrs = ethereumJsUtil.ecsign(data, privKey)

    return `${vrs.r.toString('hex')}||${vrs.s.toString('hex')}||${vrs.v}`
  },

  /**
   * ECDSA public key recovery from signature
   * @param  {Buffer|string} data  - Signed data. If it's a string, it'll be converted to a Buffer using sha3
   * @param  {string} signature    - The result of calling `localSign`. Concatenated string of vrs sign
   * @return {string} public key hex value
   */
  localRecover(data: Buffer | string, signature: string) {
    if (typeof data === 'string') {
      data = ethereumJsUtil.keccak(data)
    }
    let [r, s, v] = signature.split('||')

    const bufferR = Buffer.from(r, 'hex')
    const bufferS = Buffer.from(s, 'hex')
    const bufferV = parseInt(v, 10)

    const publicKey = ethereumJsUtil.ecrecover(data as Buffer, bufferV, bufferR, bufferS)

    return publicKey.toString('hex')
  },

  /**
   * Returns the ethereum public key of a given private key
   * @param  {Buffer|string} privKey - private key from where to derive the public key
   * @return {string} Hex public key
   */
  privateToPublicHex(privKey: Buffer | string) {
    if (typeof privKey === 'string') privKey = new Buffer(privKey, 'hex')
    return ethereumJsUtil.privateToPublic(privKey).toString('hex')
  },

  /**
   * Returns the ethereum address for a given public key
   * @param  {string} pubKey - public key from where to derive the address
   * @return {string} Hex address
   */
  pubToAddressHex(pubkey: Buffer | string) {
    if (typeof pubkey === 'string') pubkey = new Buffer(pubkey, 'hex')
    return ethereumJsUtil.pubToAddress(pubkey).toString('hex')
  },

  /**
   * Converts a HEX string to its number representation.
   * @param  {string} hexString - An HEX string to be converted to a number.
   * @return {number} The number representing the data hexString.
   */
  toDecimal(hexString: string) {
    return web3utils.toDecimal(hexString)
  },

  /**
   * Converts any ASCII string to a HEX string.
   * @param  {string} val - An ASCII string to be converted to HEX.
   * @param {number} (optional) padding - The number of bytes the returned HEX string should have.
   * @return {string} The converted HEX string.
   */
  fromAscii(val: string, padding: Number) {
    return web3utils.fromAscii(val, padding)
  }
}
