import { eth, Contract } from '../ethereum'
import { CompleteContractMethods } from './verification'

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
@CompleteContractMethods(abi)
export class MANAToken extends Contract {
  constructor(address: string) {
    super(address, abi)
  }

  getContractName() {
    return 'MANAToken'
  }

  async approve(spender: string, mana: number) {
    return this.transaction('approve', spender, eth.utils.toWei(mana))
  }

  async allowance(owner: string, spender: string) {
    const assigned = await this.call('allowance', owner, spender)
    return eth.utils.fromWei(assigned)
  }

  async balanceOf(owner: string) {
    const manaBalance = await this.call('balanceOf', owner)
    return eth.utils.fromWei(manaBalance)
  }
}
