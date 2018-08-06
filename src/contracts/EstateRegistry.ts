import { Contract } from '../ethereum'
import { fulfillContractMethods } from './verification'

const { abi } = require('./artifacts/EstateRegistry.json')

export class EstateRegistry extends Contract {
  constructor(address: string) {
    super(address, abi)
    fulfillContractMethods(this, abi)
  }

  getContractName() {
    return 'EstateRegistry'
  }
}
