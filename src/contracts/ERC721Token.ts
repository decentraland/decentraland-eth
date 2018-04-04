import { Contract } from '../ethereum'
import { CompleteContractMethods } from './verification'

const { abi } = require('./artifacts/ERC721Token.json')

/** ERC721Token contract class */
@CompleteContractMethods(abi)
export class ERC721Token extends Contract {
  constructor(address: string) {
    super(address, abi)
  }

  getContractName() {
    return 'ERC721Token'
  }
}
