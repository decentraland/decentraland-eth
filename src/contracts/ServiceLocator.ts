import { Contract } from '../ethereum'
import { fulfillContractMethods } from './verification'
const { abi } = require('./artifacts/ServiceLocator.json')

/** ServiceLocator contract class */
export class ServiceLocator extends Contract {
  constructor(address: string) {
    super(address, abi)
    fulfillContractMethods(this, abi)
  }

  getContractName() {
    return 'ServiceLocator'
  }
}
