import { Contract } from '../ethereum'

const { abi } = require('./artifacts/ERC721Bid.json')

export class ERC721Bid extends Contract {
  constructor(address: string) {
    super(address, abi)
  }

  getContractName() {
    return 'ERC721Bid'
  }
}
