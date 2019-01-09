import { Contract } from '../ethereum'
import { fulfillContractMethods } from './verification'

const { abi } = require('./artifacts/ERC721Bid.json')

export class ERC721Bid extends Contract {
  constructor(address: string) {
    super(address, abi)
    fulfillContractMethods(this, abi)
  }

  getContractName() {
    return 'ERC721Bid'
  }
}
