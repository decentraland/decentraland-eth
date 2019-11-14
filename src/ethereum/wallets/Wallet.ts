// We use this to have a typed Web3 class until fixed by web.js
// More info: https://github.com/ethereum/web3.js/issues/2363
import Web3Type from 'web3'
import { Contract, ContractOptions } from 'web3-eth-contract'
import BigNumber from 'bignumber.js'

import { Abi } from '../abi/Abi'
import { promisify } from '../../utils'

export interface TransactionReceipt {
  transactionHash: string
  transactionIndex: number
  blockHash: string
  blockNumber: number
  gasUsed: number
  cumulativeGasUsed: number
  contractAddress: string
  logs: any[]
  status: string
  logsBloom: string
}

export type TransactionStatus = {
  hash: string
  nonce: number
  blockHash: string
  blockNumber: number | null
  transactionIndex: number
  from: string
  to: string
  value: any // BigNumber
  gas: number
  gasPrice: any // BigNumber
  input: string
}

// Interface
export abstract class Wallet {
  type = this.getType()
  web3: Web3Type = null
  derivationPath = null

  constructor(private account?: string) {}

  abstract getType(): string

  isConnected() {
    return this.web3 && !!this.web3.eth
  }

  getWeb3() {
    return this.web3
  }

  getAccount() {
    if (!this.account) {
      throw new Error("The current wallet/provider doesn't have any linked account")
    }
    return this.account.toLowerCase()
  }

  setAccount(account: string) {
    if (this.web3 && this.web3.eth) {
      this.web3.eth.defaultAccount = account
    }
    this.account = account
  }

  /**
   * Connects the wallet
   * @param provider Receives the provider URL or the provider object from i.e. metamask
   */
  async connect(provider: string | object, networkId?: string) {
    throw new Error('Not implemented. Check wallet support')
  }

  disconnect() {
    this.web3 = null
    this.setAccount(null)
  }

  /**
   * Gets the appropiate Web3 provider for the given environment.
   * Check each implementation for in detail information
   * @param  {string} [providerURL] - URL for a provider.
   * @return {object} The web3 provider
   */
  async getProvider(providerUrl: string): Promise<any> {
    throw new Error('Not implemented. Check wallet support')
  }

  /**
   * Return available accounts for the current wallet
   * @return {Promise<array<string>>} accounts
   */
  async getAccounts(): Promise<any[]> {
    throw new Error('Not implemented. Check wallet support')
  }

  /**
   * Returns the balance of the account
   * @return {Promise<any>} accounts
   */
  async getBalance(coinbase: string): Promise<BigNumber> {
    const balance = await this.getWeb3().eth.getBalance(coinbase)
    return new BigNumber(balance)
  }

  async getCoinbase(): Promise<string> {
    return this.getWeb3().eth.getCoinbase()
  }

  async estimateGas(options: { data: string; to?: string }) {
    return promisify(this.getWeb3().eth.estimateGas)(options)
  }

  async sendTransaction(transactionObject: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.getWeb3()
        .eth.sendTransaction(transactionObject)
        .on('transactionHash', txHash => resolve(txHash))
        .on('error', err => reject(err))
    })
  }

  /**
   * Interface for the web3 `getTransaction` method
   * @param  {string} txId - Transaction id/hash
   * @return {object}      - An object describing the transaction (if it exists)
   */
  async getTransactionStatus(txId: string): Promise<TransactionStatus> {
    return this.getWeb3().eth.getTransaction(txId)
  }

  /**
   * Interface for the web3 `getTransactionReceipt` method. It adds the decoded logs to the result (if any)
   * @param  {string} txId - Transaction id/hash
   * @return {object} - An object describing the transaction receipt (if it exists) with it's logs
   */
  async getTransactionReceipt(txId: string): Promise<TransactionReceipt> {
    const receipt = await this.getWeb3().eth.getTransactionReceipt(txId)

    if (receipt && receipt.logs) {
      receipt.logs = Abi.decodeLogs(receipt.logs)
    }

    // TODO Start using Web3 TransactionReceipt type
    return (receipt as any) as TransactionReceipt
  }

  /**
   * Creates a new contract instance with all its methods and events defined in its json interface object (abi).
   * @param  {object} abi     - Application Binary Interface.
   * @param  {string} address - Contract address
   * @return {object} instance
   */
  createContractInstance(abi: any[], address?: string, options?: ContractOptions): Contract {
    return new this.web3.eth.Contract(abi, address, options)
  }

  /**
   * Unlocks the current account with the given password
   * @param  {string} password - Account password
   * @return {boolean} Whether the operation was successfull or not
   */
  async unlockAccount(password: string) {
    return this.web3.eth.personal.unlockAccount(this.getAccount(), password, 300)
  }

  /**
   * Signs data from the default account
   * @param  {string} message - Message to sign, ussually in Hex
   * @return {Promise<string>} signature
   */
  async sign(message: string): Promise<string> {
    throw new Error('Not implemented. Check wallet support')
  }

  /**
   * Recovers the account that signed the data
   * @param  {string} message   - Data that was signed
   * @param  {string} signature
   * @return {Promise<string>} account
   */
  async recover(message: string, signature: string): Promise<string> {
    throw new Error('Not implemented. Check wallet support')
  }
}
