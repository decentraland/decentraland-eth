import { promisify } from '../utils'
import { Abi } from './abi'
import { Event } from './Event'

/** Class to work with Ethereum contracts */
export abstract class Contract<T = any> {
  instance: T
  abi: any
  address: string

  /**
   * @param  {string} [address] - Address of the contract. If it's undefined, it'll use the result of calling {@link Contract#getDefaultAddress}
   * @param  {object} [abi]     - Object describing the contract (compile result). If it's undefined, it'll use the result of calling {@link Contract#getDefaultAbi}
   * @return {Contract} instance
   */
  constructor(address: string, abi: object) {
    this.setAddress(address)
    this.setAbi(abi)

    this.instance = null
  }

  /**
   * Checks if an address is actually 0 in hex or a falsy value
   * @param  {string} address
   * @return {boolean}
   */
  static isEmptyAddress(address) {
    return !address || address === '0x0000000000000000000000000000000000000000' || address === '0x'
  }

  /**
   * See {@link Contract#transaction}
   */
  static async transaction(method: Function, ...args): Promise<any> {
    return promisify(method)(...args)
  }

  /**
   * See {@link Contract#call}
   */
  static async call(prop, ...args): Promise<any> {
    return promisify(prop.call)(...args)
  }

  /**
   * Get the contract name
   * @return {string} - contract name
   */
  abstract getContractName(): string

  /**
   * Get the contract events from the abi
   * @return {Array<string>} - events
   */
  getEvents() {
    return Abi.new(this.abi).getEvents()
  }

  /**
   * Set's the address of the contract. It'll throw on falsy values
   * @param {string} address - Address of the contract
   */
  setAddress(address: string) {
    if (!address) {
      throw new Error('Tried to instantiate a Contract without an `address`')
    }

    this.address = address
  }

  /**
   * Set's the abi of the contract. It'll throw on falsy values
   * @param {object} abi - Abi of the contract
   */
  setAbi(abi) {
    if (!abi) {
      throw new Error('Tried to instantiate a Contract without an `abi`')
    }

    this.abi = Abi.new(abi)
  }

  setInstance(instance) {
    this.instance = instance
  }

  /**
   * Execute a write-operation, and broadcast it to be processed by miners and published on the blockchain.
   * @param  {string}    method - Method name
   * @param  {...object} args   - Every argument after the name will be fordwarded to the transaction method, in order
   * @return {Promise} - promise that resolves when the transaction does
   */
  transaction(method: string, ...args) {
    if (!this.instance[method]) {
      throw new Error(`${this.getContractName()}#transaction: Unknown method ${method}`)
    }
    if (typeof this.instance[method] !== 'function') {
      throw new Error(`${this.getContractName()}#transaction: method ${method} is not a function`)
    }
    return Contract.transaction(this.instance[method], ...args)
  }

  /**
   * Inoke a contract function that does not broadcast or publish anything on the blockchain.
   * @param  {string}    prop - Prop name
   * @param  {...object} args   - Every argument after the name will be fordwarded to the call function, in order
   * @return {Promise} - promise that resolves when the call does
   */
  call(prop: string, ...args) {
    if (!this.instance[prop]) {
      throw new Error(`${this.getContractName()}#call: Unknown method ${prop}`)
    }
    if (!this.instance[prop].call) {
      throw new Error(`${this.getContractName()}#call: property ${prop} has no call signature`)
    }
    return Contract.call(this.instance[prop], ...args)
  }

  getEvent(eventName) {
    return new Event(this, eventName)
  }
}
