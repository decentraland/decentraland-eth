import { Contract } from '../ethereum'
import { fulfillContractMethods } from './verification'
const { abi } = require('./artifacts/MortgageCreator.json')

/** MortgageCreator contract class */
export class MortgageCreator extends Contract {
  constructor(address: string) {
    super(address, abi)
    fulfillContractMethods(this, abi)
  }

  getContractName() {
    return 'MortgageCreator'
  }
}
