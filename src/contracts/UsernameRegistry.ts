import { Contract } from '../ethereum'

const { abi } = require('./artifacts/UsernameRegistry.json')

export class UsernameRegistry extends Contract {
  constructor(address: string) {
    super(address, abi)
  }

  getContractName() {
    return 'UsernameRegistry'
  }
}
