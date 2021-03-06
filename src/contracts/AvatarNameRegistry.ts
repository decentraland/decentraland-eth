import { Contract } from '../ethereum'

const { abi } = require('./artifacts/AvatarNameRegistry.json')

export class AvatarNameRegistry extends Contract {
  constructor(address: string) {
    super(address, abi)
  }

  getContractName() {
    return 'AvatarNameRegistry'
  }
}
