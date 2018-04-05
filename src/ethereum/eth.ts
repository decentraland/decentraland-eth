import { NodeWallet, LedgerWallet } from './wallets'
import { ethUtils } from './ethUtils'
import { promisify } from '../utils/index'
import { Contract } from './Contract'
import { error } from 'util'
import { Wallet } from './wallets/Wallet'

export type ConnectOptions = {
  /** An array of objects defining contracts or Contract subclasses to use. Check {@link eth#setContracts} */
  contracts?: any[]
  /** Override the default account address */
  defaultAccount?: any
  /** URL for a provider forwarded to {@link Wallet#getWeb3Provider} */
  providerUrl?: string
  provider?: object
  derivationPath?: string
}

export namespace eth {
  /**
   * Filled on .connect()
   */
  export let contracts = {}
  export let wallet: Wallet = null

  /**
   * Reference to the utilities object {@link ethUtils}
   */
  export const utils = ethUtils

  /**
   * Connect to web3
   * @param  {object} [options] - Options for the ETH connection
   * @param  {array<Contract>} [options.contracts=[]] - An array of objects defining contracts or Contract subclasses to use. Check {@link eth#setContracts}
   * @param  {string} [options.defaultAccount=web3.eth.accounts[0]] - Override the default account address
   * @param  {string} [options.providerUrl] - URL for a provider forwarded to {@link Wallet#getWeb3Provider}
   * @param  {string} [options.provider] - A provider given by other library/plugin
   * @param  {string} [options.derivationPath] - Path to derive the hardware wallet in. Defaults to each wallets most common value
   * @return {boolean} - True if the connection was successful
   */
  export async function connect(options: ConnectOptions = {}) {
    if (isConnected()) {
      disconnect()
    }

    const { defaultAccount, provider, providerUrl, derivationPath } = options

    try {
      wallet = await connectWallet(defaultAccount, provider || providerUrl, derivationPath)

      // connect old contracts
      await setContracts(Object.values(contracts))

      // connect new contracts
      await setContracts(options.contracts || [])

      return true
    } catch (error) {
      console.info(`Error trying to connect Ethereum wallet: ${error.message}`)
      return false
    }
  }

  export async function connectWallet(
    defaultAccount: string,
    provider: object | string = '',
    derivationPath = null
  ): Promise<any> {
    let wallet: Wallet
    const networks = getNetworks()

    try {
      const network =
        typeof provider === 'string'
          ? networks.find(network => provider.includes(network.name)) || networks[0]
          : networks[0]

      wallet = new LedgerWallet(defaultAccount, derivationPath)
      await wallet.connect(provider, network.id)
    } catch (error) {
      wallet = new NodeWallet(defaultAccount)
      await wallet.connect(provider)
    }

    return wallet
  }

  export function isConnected() {
    return wallet && wallet.isConnected()
  }

  export function disconnect() {
    if (wallet) {
      wallet.disconnect()
    }
    wallet = null
    contracts = {}
  }

  export function getAddress() {
    return getAccount()
  }

  export function getAccount() {
    return wallet.getAccount()
  }

  export function getWalletAttributes() {
    return {
      account: wallet.account,
      type: wallet.type,
      derivationPath: wallet.derivationPath
    }
  }

  /**
   * Set the Ethereum contracts to use on the `contracts` property. It builds a map of
   *   { [Contract Name]: Contract instance }
   * usable later via `.getContract`. Check {@link https://github.com/decentraland/decentraland-eth/tree/master/src/ethereum} for more info
   * @param  {array<Contract|object>} contracts - An array comprised of a wide variety of options: objects defining contracts, Contract subclasses or Contract instances.
   */
  export async function setContracts(_contracts: Contract[]) {
    if (!isConnected()) {
      throw new Error('Tried to set eth contracts without connecting successfully first')
    }

    for (const contractData of _contracts) {
      let contract: Contract = null
      let contractName: string = null

      if (typeof contractData === 'object' && contractData instanceof Contract) {
        // contractData is an instance of Contract or of one of its subclasses
        contract = contractData
        contractName = contract.getContractName()
      } else {
        error('The parameter is not instance of a contract', contractData)
      }

      if (!contractName) continue

      const instance = await wallet.createContractInstance(contract.abi, contract.address)
      contract.setInstance(instance)

      contracts[contractName] = contract
    }
  }

  /**
   * Get a contract instance built on {@link eth#setContracts}
   * It'll throw if the contract is not found on the `contracts` mapping
   * @param  {string} name - Contract name
   * @return {object} contract
   */
  export function getContract(name: string) {
    if (!contracts[name]) {
      const contractNames = Object.keys(contracts)
      throw new Error(
        `The contract ${name} not found.\nDid you add it to the '.connect()' call?\nAvailable contracts are "${JSON.stringify(
          contractNames
        )}"`
      )
    }

    return contracts[name]
  }

  export async function sign(payload) {
    const message = ethUtils.toHex(payload)
    const signature = await wallet.sign(message)
    return { message, signature }
  }

  export async function recover(message, signature) {
    return wallet.recover(message, signature)
  }

  /**
   * Get a list of known networks
   * @return {array} - An array of objects describing each network: { id, name, label }
   */
  export function getNetworks() {
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
        id: '42',
        name: 'kovan',
        label: 'Kovan Test Network'
      }
    ]
  }

  /**
   * Interface for the web3 `getNetwork` method (it adds the network name and label).
   * @return {object} - An object describing the current network: { id, name, label }
   */
  export async function getNetwork() {
    const id = await promisify(wallet.getWeb3().version.getNetwork)()
    const networks = getNetworks()
    const network = networks.find(network => network.id === id)
    if (!network) {
      throw new Error(`Unknown Network id: ${id}`)
    }
    return network
  }
}
