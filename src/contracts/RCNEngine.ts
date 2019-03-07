import { Contract } from '../ethereum'
const { abi } = require('./artifacts/RCNEngine.json')

/** RCNEngine contract class */
export class RCNEngine extends Contract {
  constructor(address: string) {
    super(address, abi)
  }

  getContractName() {
    return 'RCNEngine'
  }
}
