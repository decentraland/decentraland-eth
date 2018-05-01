import { eth, Contract } from '../ethereum'
import { fulfillContractMethods } from './verification'
const { abi } = require('./artifacts/TerraformReserve.json')

/** TerraformReserve contract class */
export class TerraformReserve extends Contract {
  constructor(address: string) {
    super(address, abi)
    fulfillContractMethods(this, abi)
  }

  getContractName() {
    return 'TerraformReserve'
  }

  lockMana(sender, mana) {
    return this.lockManaWei(sender, eth.utils.toWei(mana))
  }

  lockManaWei(sender: string, mana, opts = { gas: 1200 }) {
    // TODO: unlock account here?
    return this.sendTransaction('lockMana', sender, mana, opts)
  }
}
