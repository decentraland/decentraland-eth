import { eth, Contract } from '../ethereum'
import { fulfillContractMethods } from './verification'

const { abi } = require('./artifacts/MANAToken.json')

export interface MANAToken {
  mintingFinished(): Promise<boolean>
  name(): Promise<string>
  totalSupply(): Promise<any /* BigNumber */>
  transferFrom(from: string, to: string, value): Promise<boolean>
  decimals(): Promise<number>
  unpause(): Promise<boolean>
  mint(to: string, amount): Promise<string>
  burn(value): Promise<void>
  paused(): Promise<boolean>
  finishMinting(): Promise<boolean>
  pause(): Promise<boolean>
  owner(): Promise<string>
  symbol(): Promise<string>
  transferOwnership(newOwner: string): Promise<void>
  transfer(to: string, value): Promise<boolean>
}

/** MANAToken contract class */
export class MANAToken extends Contract {
  constructor(address: string) {
    super(address, abi)
    fulfillContractMethods(this, abi)
  }

  getContractName() {
    return 'MANAToken'
  }

  async approve(spender: string, mana: number) {
    return this.sendTransaction('approve', spender, eth.utils.toWei(mana))
  }

  async allowance(owner: string, spender: string) {
    const assigned = await this.sendCall('allowance', owner, spender)
    return eth.utils.fromWei(assigned)
  }

  async balanceOf(owner: string): Promise<number> {
    const manaBalance = await this.sendCall('balanceOf', owner)
    return eth.utils.fromWei(manaBalance)
  }
}
