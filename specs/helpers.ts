import { w3cwebsocket } from 'websocket'
import { providers } from 'eth-connect'
import 'isomorphic-fetch'

export function testGeth(doTest: (provider: any) => void) {
  describe('Transport: WS', function() {
    this.timeout(99999999)

    const provider = new providers.WebSocketProvider('ws://127.0.0.1:8546', {
      WebSocketConstructor: w3cwebsocket
    })

    it('waits the provider to be connected', async () => {
      await provider.connection
    })

    doTest(provider)

    after('should close the server & dispose provider', function() {
      provider.dispose()
    })
  })
}
