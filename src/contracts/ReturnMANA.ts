import { Contract } from '../ethereum'

const { abi } = require('./artifacts/ReturnMANA.json')

/** ReturnMANA contract class */
export class ReturnMANA extends Contract {
  constructor(address: string) {
    super(address, abi)
  }

  getContractName() {
    return 'ReturnMANA'
  }
}
