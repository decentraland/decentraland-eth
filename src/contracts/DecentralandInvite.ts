import { Contract } from '../ethereum'

const { abi } = require('./artifacts/DecentralandInvite.json')

/** DecentralandInvite contract class */
export class DecentralandInvite extends Contract {
  constructor(address: string) {
    super(address, abi)
  }

  getContractName() {
    return 'DecentralandInvite'
  }
}
