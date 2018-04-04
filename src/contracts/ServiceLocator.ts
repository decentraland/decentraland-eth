import { Contract } from '../ethereum'
import { CompleteContractMethods } from './verification'
const { abi } = require('./artifacts/ServiceLocator.json')

/** ServiceLocator contract class */
@CompleteContractMethods(abi)
export class ServiceLocator extends Contract {
  constructor(address: string) {
    super(address, abi)
  }

  getContractName() {
    return 'ServiceLocator'
  }
}
