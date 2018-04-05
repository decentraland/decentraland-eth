import { Contract } from '../ethereum'
import { fulfillContractMethods } from './verification'

const { abi } = require('./artifacts/ReturnMANA.json')

/** ReturnMANA contract class */
export class ReturnMANA extends Contract {
  constructor(address: string) {
    super(address, abi)
    fulfillContractMethods(this, abi)
  }

  getContractName() {
    return 'ReturnMANA'
  }
}
