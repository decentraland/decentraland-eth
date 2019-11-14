const Web3 = require('web3')
import { WebsocketProvider } from 'web3-core'

import 'isomorphic-fetch'

export function testGeth(doTest: (provider: any) => void) {
  describe('Transport: WS', function() {
    this.timeout(99999999)

    const provider: WebsocketProvider = new Web3.providers.WebsocketProvider('ws://127.0.0.1:8546')

    it('waits the provider to be connected', async () => {
      await provider.connection
    })

    doTest(provider)
  })
}
