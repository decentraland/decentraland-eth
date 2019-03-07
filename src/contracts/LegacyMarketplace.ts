import { Contract } from '../ethereum'

const { abi } = require('./artifacts/LegacyMarketplace.json')

/** LegacyMarketplace contract class */
export class LegacyMarketplace extends Contract {
  constructor(address: string) {
    super(address, abi)
  }

  getContractName() {
    return 'LegacyMarketplace'
  }
}
