import { Contract } from '../ethereum'
import { fulfillContractMethods } from './verification'

const { abi } = require('./artifacts/DecentralandInvite.json')

/** DecentralandInvite contract class */
export class DecentralandInvite extends Contract {
  constructor(address: string) {
    super(address, abi)
    fulfillContractMethods(this, abi)
  }

  getContractName() {
    return 'DecentralandInvite'
  }
}
