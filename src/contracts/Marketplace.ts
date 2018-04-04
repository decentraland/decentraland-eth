import { Contract } from '../ethereum'
import { CompleteContractMethods } from './verification'

const { abi } = require('./artifacts/Marketplace.json')

/** Marketplace contract class */
@CompleteContractMethods(abi)
export class Marketplace extends Contract {
  constructor(address: string) {
    super(address, abi)
  }

  getContractName() {
    return 'Marketplace'
  }
}
