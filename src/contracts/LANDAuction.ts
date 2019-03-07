import { Contract } from '../ethereum'

const { abi } = require('./artifacts/LANDAuction.json')

export class LANDAuction extends Contract {
  constructor(address: string) {
    super(address, abi)
  }

  getContractName() {
    return 'LANDAuction'
  }
}
