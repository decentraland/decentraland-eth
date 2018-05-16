import { ERC20Token } from './ERC20Token'

/** RCNToken contract class */
export class RCNToken extends ERC20Token {
  constructor(address: string) {
    super(address)
  }

  getContractName() {
    return 'RCNToken'
  }
}
