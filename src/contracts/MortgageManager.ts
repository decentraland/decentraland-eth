import { Contract } from '../ethereum'
import { fulfillContractMethods } from './verification'
const { abi } = require('./artifacts/MortgageManager.json')

/** MortgageManager contract class */
export class MortgageManager extends Contract {
  constructor(address: string) {
    super(address, abi)
    fulfillContractMethods(this, abi)
  }

  getContractName() {
    return 'MortgageManager'
  }
}
