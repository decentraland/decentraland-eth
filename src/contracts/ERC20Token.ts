import { Contract } from '../ethereum'
import { CompleteContractMethods } from './verification'

const { abi } = require('./artifacts/ERC20Token.json')

/** ERC20Token contract class */
@CompleteContractMethods(abi)
export class ERC20Token extends Contract {
  constructor(address: string) {
    super(address, abi)
  }

  getContractName() {
    return 'ERC20Token'
  }
}
