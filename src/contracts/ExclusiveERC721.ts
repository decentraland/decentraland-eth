import { Contract } from '../ethereum'

const { abi } = require('./artifacts/ExclusiveERC721.json')

export class ExclusiveERC721 extends Contract {
  constructor(address: string) {
    super(address, abi)
  }

  getContractName() {
    return 'ExclusiveERC721'
  }
}
