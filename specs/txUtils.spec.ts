import { expect } from 'chai'
import { deployContract } from './deployContract'
import { eth, txUtils } from '../dist'
import { testGeth } from './helpers'

testGeth(provider => {
  it('initializes eth provider', async () => {
    await eth.connect({ provider })
  })

  describe('txUtils tests', () => {
    describe('.getTransaction', function() {
      it('should return the confirmed transaction status and its receipt', async function() {
        this.timeout(100000)

        const contract = await deployContract(eth.wallet, 'MANA', require('./fixtures/MANAToken.json'))
        /* tslint:disable-next-line:no-unnecessary-type-assertion */
        const { receipt, ...tx } = (await txUtils.getTransaction(
          contract.transactionHash
        )) as txUtils.ConfirmedTransaction

        expect(tx).to.include.keys([
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

        expect(tx.hash).to.be.match(/0x[a-fA-F0-9]{64}/)

        expect(receipt).to.include.keys([
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

        expect(receipt.transactionHash).to.be.match(/0x[a-fA-F0-9]{64}/)
        expect(receipt.transactionHash).to.be.equal(tx.hash)
      })

      it('should return null for an unknown transaction', async function() {
        const tx = await txUtils.getTransaction('0x505d58d5b6a38304deaad305ff2d773354cc939afc456562ba6bddbbf201e27f')
        expect(tx).to.be.null // tslint:disable-line
      })
    })

    describe('.getConfirmedTransaction', function() {
      it('should return the confirmed transaction', async function() {
        const account = eth.getAccount()
        const txId = await eth.wallet.sendTransaction({
          from: account,
          data: '0xfafafa',
          value: 0,
          to: account,
          gas: 1000000
        })

        const tx = await txUtils.getConfirmedTransaction(txId)
        expect(tx.type).to.be.equal('confirmed')
      })
    })
  })
})
