import { Contract } from '../ethereum'

const { abi } = require('./artifacts/ERC721Collection.json')

export class ERC721Collection extends Contract {
  constructor(address: string) {
    super(address, abi)
  }

  getContractName() {
    return 'ERC721Collection'
  }
}
