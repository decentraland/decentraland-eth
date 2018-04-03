import { eth, Contract } from '../ethereum'

const { abi } = require('./artifacts/DecentralandVesting.json')

export type BigNumber = {
  toNumber(): number
}

/** DecentralandVesting contract class */
export class DecentralandVesting extends Contract {
  constructor(address: string = process.env.TERRAFORM_RESERVE_CONTRACT_ADDRESS) {
    super(address, abi)
  }

  getContractName() {
    return 'DecentralandVesting'
  }

  async duration() {
    const bigNumber: BigNumber = await this.call('duration')
    return bigNumber.toNumber()
  }

  async cliff() {
    const bigNumber: BigNumber = await this.call('cliff')
    return bigNumber.toNumber()
  }

  async vestedAmount() {
    const bigNumber: BigNumber = await this.call('vestedAmount')
    return eth.utils.fromWei(bigNumber.toNumber())
  }

  async releasableAmount() {
    const bigNumber: BigNumber = await this.call('releasableAmount')
    return eth.utils.fromWei(bigNumber.toNumber())
  }

  async released() {
    const bigNumber: BigNumber = await this.call('released')
    return eth.utils.fromWei(bigNumber.toNumber())
  }

  async start() {
    const bigNumber: BigNumber = await this.call('start')
    return bigNumber.toNumber()
  }
}
