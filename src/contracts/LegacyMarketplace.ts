import { Contract } from '../ethereum'
import { fulfillContractMethods } from './verification'

const { abi } = require('./artifacts/LegacyMarketplace.json')

/** LegacyMarketplace contract class */
export class LegacyMarketplace extends Contract {
  constructor(address: string) {
    super(address, abi)
    fulfillContractMethods(this, abi)
  }

  getContractName() {
    return 'LegacyMarketplace'
  }
}
