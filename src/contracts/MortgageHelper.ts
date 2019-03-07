import { Contract } from '../ethereum'
const { abi } = require('./artifacts/MortgageHelper.json')

/** MortgageCreator contract class */
export class MortgageHelper extends Contract {
  constructor(address: string) {
    super(address, abi)
  }

  getContractName() {
    return 'MortgageHelper'
  }
}
