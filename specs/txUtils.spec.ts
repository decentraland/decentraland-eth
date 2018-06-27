import { expect } from 'chai'
import { NodeConnectionFactory } from './NodeConnectionFactory'
import { deployContract } from './deployContract'
import { eth, txUtils } from '../dist'

describe('txUtils tests', () => {
  const DEFAULT_FETCH_DELAY = txUtils.TRANSACTION_FETCH_DELAY
  const nodeConnectionFactory = new NodeConnectionFactory()
  let provider

  before(() => {
    provider = nodeConnectionFactory.createProvider()
    return eth.connect({ provider })
  })

  describe('.getTransaction', function() {
    it('should return the transaction status and its recepeit', async function() {
      this.timeout(100000)

      const contract = await deployContract(eth.wallet, 'MANA', require('./fixtures/MANAToken.json'))
      const { recepeit, ...tx } = await txUtils.getTransaction(contract.transactionHash)

      expect(Object.keys(tx)).to.be.deep.equal([
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

      expect(Object.keys(recepeit)).to.be.deep.equal([
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
      expect(recepeit.transactionHash).to.be.equal('0x505d58d5b6a38304deaad305ff2d773354cc939afc456562ba6bddbbf201e27f')
    })

    it('should return null if the tx hash is invalid or dropped', async () => {
      const invalidTx = await txUtils.getTransaction(
        '0xc15c7dda554711eac29d4a983e53aa161dd1bdc6e1d013bb29da1f607916de1'
      )
      expect(invalidTx).to.be.equal(null)

      const droppedTx = await txUtils.getTransaction(
        '0x24615f57f5754f2479d6657f7ac9a56006d8d6f634c6955310a5af1c79f4969'
      )
      expect(droppedTx).to.be.equal(null)
    })
  })

  describe('.isTxDropped', function() {
    it('should wait TRANSACTION_FETCH_DELAY for each retry attempts', async function() {
      txUtils.TRANSACTION_FETCH_DELAY = 50
      const retryAttemps = 5
      const totalTime = 5 * 50

      const begining = Date.now()
      await txUtils.isTxDropped('0x24615f57f5754f2479d6657f7ac9a56006d8d6f634c6955310a5af1c79f4969', retryAttemps)
      const end = Date.now()
      const delay = end - begining

      expect(delay).to.be.within(totalTime, totalTime + 100) // give it 100ms of leway
    })

    afterEach(() => {
      txUtils.TRANSACTION_FETCH_DELAY = DEFAULT_FETCH_DELAY
    })
  })

  describe('.waitForCompletion', function() {
    it('should return a failed tx for a dropped hash', async function() {
      txUtils.TRANSACTION_FETCH_DELAY = 10

      const droppedTx = await txUtils.waitForCompletion(
        '0x24615f57f5754f2479d6657f7ac9a56006d8d6f634c6955310a5af1c79f4969'
      )

      expect(droppedTx).to.be.deep.equal({
        hash: '0x24615f57f5754f2479d6657f7ac9a56006d8d6f634c6955310a5af1c79f4969',
        status: txUtils.TRANSACTION_STATUS.failed,
        isDropped: true
      })
    })

    it('should return the full transaction after it finishes', async function() {
      txUtils.TRANSACTION_FETCH_DELAY = 10

      // compiled solidity source code
      const code =
        '603d80600c6000396000f3007c01000000000000000000000000000000000000000000000000000000006000350463c6888fa18114602d57005b6007600435028060005260206000f3'
      const txHash = await eth.wallet.sendTransaction({ data: code })
      const tx = await txUtils.waitForCompletion(txHash)

      expect(tx.hash).to.be.equal(txHash)
      expect(tx.recepeit).not.to.be.equal(undefined)
    })

    afterEach(() => {
      txUtils.TRANSACTION_FETCH_DELAY = DEFAULT_FETCH_DELAY
    })
  })
})
