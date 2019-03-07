import { Contract } from '../ethereum'
const { abi } = require('./artifacts/MortgageManager.json')

/** MortgageManager contract class */
export class MortgageManager extends Contract {
  constructor(address: string) {
    super(address, abi)
  }

  getContractName() {
    return 'MortgageManager'
  }
}
