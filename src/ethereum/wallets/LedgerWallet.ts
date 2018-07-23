import Web3 = require('web3')

import TransportU2F from '@ledgerhq/hw-transport-u2f'
import Eth from '@ledgerhq/hw-app-eth'

import * as ProviderEngine from 'web3-provider-engine'
import * as RpcSubprovider from 'web3-provider-engine/subproviders/rpc'
import createLedgerSubprovider from '@ledgerhq/web3-subprovider'

import { Wallet } from './Wallet'
import { sleep } from '../../utils'

// From https://github.com/LedgerHQ/ledgerjs/blob/master/packages/web3-subprovider/src/index.js#L32
export interface LedgerProviderOptions {
  // refer to https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md
  networkId: number
  // derivation path
  path?: string
  // should use actively validate on the device
  askConfirm?: boolean
  // number of accounts to derivate
  accountsLength?: number
  // offset index to use to start derivating the accounts
  accountsOffset?: number
}

export class LedgerWallet extends Wallet {
  ledger = null
  engine = null
  derivationPath = "44'/60'/0'/0"

  constructor(account: string, derivationPath: string) {
    super(account)

    this.derivationPath = derivationPath || "44'/60'/0'/0"
  }

  static async isSupported() {
    const devices = await TransportU2F.list()
    return devices.length > 0
  }

  getType() {
    return 'ledger'
  }

  async connect(providerUrl: object | string, networkId?: string) {
    if (typeof providerUrl === 'object') {
      throw new Error('Ledger wallet only allows string providers')
    }

    if (!providerUrl || !networkId) {
      throw new Error('You must provide both providerUrl and networkId')
    }

    const transport = await TransportU2F.open(null, 2)

    this.ledger = new Eth(transport)

    this.engine = new ProviderEngine()

    const provider = await this.getProvider(providerUrl, {
      networkId: parseInt(networkId, 10)
    })
    this.web3 = new Web3(provider)

    try {
      // FireFox hangs on indefinetly on `getAccounts`, so the second promise acts as a timeout
      const accounts = await Promise.race([
        this.getAccounts(),
        sleep(2000).then(() => Promise.reject({ message: 'Timed out trying to connect to ledger' }))
      ])

      if (accounts[0]) {
        this.setAccount(accounts[0])
      }
    } catch {
      // do nothing
    }
  }

  disconnect() {
    super.disconnect()

    if (this.engine) {
      this.engine.stop()
      this.engine = null
    }
  }

  /**
   * It'll create a new provider using the providerUrl param for RPC calls
   * @param  [providerURL="https://mainnet.infura.io/"] - URL for an HTTP provider
   * @param  [options] - List of provider options, from https://github.com/LedgerHQ/ledgerjs/blob/master/packages/web3-subprovider/src/index.js#L32
   * @return The web3 provider
   */
  async getProvider(providerUrl = 'https://mainnet.infura.io/', options?: LedgerProviderOptions): Promise<any> {
    const subproviderOptions = Object.assign({ networkId: 1, path: this.derivationPath, askConfirm: true }, options)
    const ledgerWalletSubProvider = await createLedgerSubprovider(() => TransportU2F.create(), subproviderOptions)

    this.engine.addProvider(ledgerWalletSubProvider)
    this.engine.addProvider(
      new RpcSubprovider({
        rpcUrl: providerUrl
      })
    )
    this.engine.start()

    return this.engine
  }

  async getAccounts() {
    const defaultAccount = await this.ledger.getAddress(this.derivationPath)
    return [defaultAccount.address] // follow the Wallet interface
  }

  async sign(message: string): Promise<string> {
    let { v, r, s } = await this.ledger.signPersonalMessage(this.derivationPath, message.substring(2))

    v = (v - 27).toString(16)
    if (v.length < 2) v = '0' + v

    return '0x' + r + s + v
  }
}
