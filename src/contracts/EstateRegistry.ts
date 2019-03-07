import { Contract } from '../ethereum'

const { abi } = require('./artifacts/EstateRegistry.json')

export class EstateRegistry extends Contract {
  constructor(address: string) {
    super(address, abi)
  }

  getContractName() {
    return 'EstateRegistry'
  }
}
