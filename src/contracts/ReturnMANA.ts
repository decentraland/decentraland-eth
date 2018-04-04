import { Contract } from '../ethereum'
import { CompleteContractMethods } from './verification'

const { abi } = require('./artifacts/ReturnMANA.json')

/** ReturnMANA contract class */
@CompleteContractMethods(abi)
export class ReturnMANA extends Contract {
  constructor(address: string) {
    super(address, abi)
  }

  getContractName() {
    return 'ReturnMANA'
  }
}
