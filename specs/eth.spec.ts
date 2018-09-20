import { expect } from 'chai'
import { NodeConnectionFactory } from './NodeConnectionFactory'
import { eth, txUtils } from '../dist'

describe('Eth tests', () => {
  const nodeConnectionFactory = new NodeConnectionFactory()
  let provider

  before(() => {
    provider = nodeConnectionFactory.createProvider()
    return eth.connect({ provider })
  })

  describe('.getTransactionsByAccount', function() {
    it('should return the right amount of txs', async function() {
      const account = eth.getAccount()

      const txId = await eth.wallet.sendTransaction({ from: account })
      await txUtils.getConfirmedTransaction(txId)
      const txs = await eth.getTransactionsByAccount(account)
      expect(txs.length).to.be.equal(1)

      const txId2 = await eth.wallet.sendTransaction({ from: account })
      await txUtils.getConfirmedTransaction(txId2)
      const txs2 = await eth.getTransactionsByAccount(account)
      expect(txs2.length).to.be.equal(2)
    })
  })
})
