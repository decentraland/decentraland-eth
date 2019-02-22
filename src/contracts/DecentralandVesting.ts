import { eth, Contract } from '../ethereum'
import { fulfillContractMethods } from './verification'
import { BigNumber } from 'bignumber.js'

const { abi } = require('./artifacts/DecentralandVesting.json')

/** DecentralandVesting contract class */
export class DecentralandVesting extends Contract {
  constructor(address: string = process.env.TERRAFORM_RESERVE_CONTRACT_ADDRESS) {
    super(address, abi)
    fulfillContractMethods(this, abi)
  }

  getContractName() {
    return 'DecentralandVesting'
  }

  async duration() {
    const bigNumber: BigNumber = await this.sendCall('duration')
    return bigNumber.toNumber()
  }

  async cliff() {
    const bigNumber: BigNumber = await this.sendCall('cliff')
    return bigNumber.toNumber()
  }

  async vestedAmount() {
    const bigNumber: BigNumber = await this.sendCall('vestedAmount')
    return eth.utils.fromWei(bigNumber.toNumber())
  }

  async releasableAmount() {
    const bigNumber: BigNumber = await this.sendCall('releasableAmount')
    return eth.utils.fromWei(bigNumber.toNumber())
  }

  async released() {
    const bigNumber: BigNumber = await this.sendCall('released')
    return eth.utils.fromWei(bigNumber.toNumber())
  }

  async start() {
    const bigNumber: BigNumber = await this.sendCall('start')
    return bigNumber.toNumber()
  }
}
