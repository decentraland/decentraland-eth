import { Contract } from '../ethereum'

const { abi } = require('./artifacts/Marketplace.json')

/** Marketplace contract class */
export class Marketplace extends Contract {
  constructor(address: string) {
    super(address, abi)
  }

  getContractName() {
    return 'Marketplace'
  }
}
