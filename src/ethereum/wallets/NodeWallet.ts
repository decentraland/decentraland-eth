import Web3 = require('web3')

import { Wallet } from './Wallet'
import { Contract } from '../Contract'

declare var window

export class NodeWallet extends Wallet {
  web3: any

  getType(): string {
    return 'node'
  }

  async connect(provider: object | string) {
    const theProvider = typeof provider === 'object' ? provider : await this.getProvider(provider)

    if (!theProvider) {
      throw new Error('Could not get a valid provider for web3')
    }

    this.web3 = new Web3(theProvider)

    const accounts = await this.getAccounts()

    if (accounts.length !== 0) {
      this.setAccount(accounts[0])
    }
  }

  /**
   * It'll fetch the provider from the `window` object or default to a new HttpProvider instance
   * @param  {string} [providerURL="http://localhost:8545"] - URL for an HTTP provider in case the browser provider is not present
   * @return {object} The web3 provider
   */
  getProvider(providerUrl: string = 'http://localhost:8545') {
    if (typeof window !== 'undefined' && window.web3 && window.web3.currentProvider) {
      return window.web3.currentProvider
    } else {
      return new Web3.providers.HttpProvider(providerUrl)
    }
  }

  async getAccounts(): Promise<any[]> {
    return Contract.sendTransaction(this.web3.eth.getAccounts)
  }

  async sign(message: string) {
    const account = this.getAccount()
    const sign = this.web3.personal.sign.bind(this.web3.personal)
    return Contract.sendTransaction(sign, message, account)
  }

  async recover(message: string, signature: string) {
    const recover = this.web3.personal.ecRecover.bind(this.web3.personal)
    return Contract.sendTransaction(recover, message, signature)
  }
}
