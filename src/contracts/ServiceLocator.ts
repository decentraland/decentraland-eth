import { Contract } from '../ethereum'
const { abi } = require('./artifacts/ServiceLocator.json')

/** ServiceLocator contract class */
export class ServiceLocator extends Contract {
  constructor(address: string) {
    super(address, abi)
  }

  getContractName() {
    return 'ServiceLocator'
  }
}
