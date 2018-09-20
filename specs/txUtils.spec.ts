import { expect } from 'chai'
import { NodeConnectionFactory } from './NodeConnectionFactory'
import { deployContract } from './deployContract'
import { eth, txUtils } from '../dist'

describe('txUtils tests', () => {
  const nodeConnectionFactory = new NodeConnectionFactory()
  let provider

  before(() => {
    provider = nodeConnectionFactory.createProvider()
    return eth.connect({ provider })
  })

  describe('.getTransaction', function() {
    it('should return the confirmed transaction status and its receipt', async function() {
      this.timeout(100000)

      const contract = await deployContract(eth.wallet, 'MANA', require('./fixtures/MANAToken.json'))
      /* tslint:disable-next-line:no-unnecessary-type-assertion */
      const { receipt, ...tx } = (await txUtils.getTransaction(
        contract.transactionHash
      )) as txUtils.ConfirmedTransaction

      expect(Object.keys(tx)).to.be.deep.equal([
        'type',
        'hash',
        'nonce',
        'blockHash',
        'blockNumber',
        'transactionIndex',
        'from',
        'to',
        'value',
        'gas',
        'gasPrice',
        'input'
      ])
      expect(tx.hash).to.be.equal('0x505d58d5b6a38304deaad305ff2d773354cc939afc456562ba6bddbbf201e27f')

      expect(Object.keys(receipt)).to.be.deep.equal([
        'transactionHash',
        'transactionIndex',
        'blockHash',
        'blockNumber',
        'gasUsed',
        'cumulativeGasUsed',
        'contractAddress',
        'logs',
        'status',
        'logsBloom'
      ])
      expect(receipt.transactionHash).to.be.equal('0x505d58d5b6a38304deaad305ff2d773354cc939afc456562ba6bddbbf201e27f')
    })

    it('should return null for an unknown transaction', async function() {
      const tx = await txUtils.getTransaction('0xfaceb00c')
      expect(tx).to.be.null // tslint:disable-line
    })
  })

  describe('.getConfirmedTransaction', function() {
    it('should return the confirmed transaction', async function() {
      const account = eth.getAccount()
      const txId = await eth.wallet.sendTransaction({ from: account })
      const tx = await txUtils.getConfirmedTransaction(txId)
      expect(tx.type).to.be.equal('confirmed')
    })
  })
})
