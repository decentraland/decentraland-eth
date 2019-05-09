import { Contract } from '../ethereum'

const { abi } = require('./artifacts/ClaimName.json')

export class ClaimName extends Contract {
  constructor(address: string) {
    super(address, abi)
  }

  getContractName() {
    return 'ClaimName'
  }
}
