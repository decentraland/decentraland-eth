import { Contract } from '../ethereum'
import { fulfillContractMethods } from './verification'
const { abi } = require('./artifacts/MortgageHelper.json')

/** MortgageCreator contract class */
export class MortgageHelper extends Contract {
  constructor(address: string) {
    super(address, abi)
    fulfillContractMethods(this, abi)
  }

  getContractName() {
    return 'MortgageHelper'
  }
}
