import { Contract } from '../ethereum'
import { fulfillContractMethods } from './verification'
const { abi } = require('./artifacts/RCNEngine.json')

/** RCNEngine contract class */
export class RCNEngine extends Contract {
  constructor(address: string) {
    super(address, abi)
    fulfillContractMethods(this, abi)
  }

  getContractName() {
    return 'RCNEngine'
  }
}
