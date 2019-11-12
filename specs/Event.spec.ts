import { expect } from 'chai'
import * as sinon from 'sinon'

import { deployContract } from './deployContract'
import { eth, txUtils } from '../dist'
import { MANAToken } from '../dist/contracts'
import { sleep } from '../dist/utils'
import { testGeth } from './helpers'

testGeth(provider => {
  it('connects the provider', async () => {
    await eth.connect({ provider })
  })

  describe('Events tests', function() {
    let manaAddress = '0x0'
    let MANAFacade: MANAToken
    let account = '0x0'

    async function deployManaContract() {
      const transactionHash = await deployContract(eth.wallet, 'MANA', require('./fixtures/MANAToken.json'))

      while (true) {
        const tx = await txUtils.getTransaction(transactionHash)
        if (tx.type !== 'pending') {
          expect(tx.type).to.eq('confirmed', 'could not deploy MANA contract')
          break
        }
      }

      const txRecipt = await eth.wallet.getTransactionReceipt(transactionHash)
      manaAddress = txRecipt.contractAddress

      MANAFacade = new MANAToken(manaAddress)
      await eth.setContracts([MANAFacade])
      account = eth.wallet.getAccount()
    }

    async function watchMintEvents(type, options, callback, value) {
      const mint = MANAFacade.getEvent('Mint')
      if (options) {
        mint[type](options, callback)
      } else {
        mint[type](callback)
      }
      await MANAFacade.mint(account, 10)
      await sleep(500)
      expect(callback.called).to.equal(value)
    }

    async function getMintEvents(type, options, callback, times) {
      for (let i = 0; i < times; i++) {
        await MANAFacade.mint(account, 10)
      }
      await sleep(500)
      const mint = MANAFacade.getEvent('Mint')
      if (options) {
        mint[type](options, callback)
      } else {
        mint[type](callback)
      }
      await sleep(500)
    }

    beforeEach(async () => {
      await deployManaContract()
    })

    describe('getEvent', function() {
      it('should get event', function() {
        const mint = MANAFacade.getEvent('Mint')
        expect(mint).to.not.eq(null)
      })
      it('should throw if event does not exist', function() {
        expect(() => MANAFacade.getEvent('asdasd')).to.throw()
      })
    })

    describe('Watch', function() {
      let callback = null
      beforeEach(async function() {
        callback = sinon.spy()
      })
      describe('watch', function() {
        it('should watch Mint event without options', async function() {
          await watchMintEvents('watch', null, callback, true)
        })
        it('should watch Mint event with options ', async function() {
          await watchMintEvents('watch', {}, callback, true)
        })
        it('should not watch Mint event with args filter', async function() {
          await watchMintEvents(
            'watch',
            {
              args: {
                to: '0xebc757b8bfd562158b1bfded4e1cafe332d9845b'
              }
            },
            callback,
            false
          )
        })
        it('should watch Mint event with args filter', async function() {
          await watchMintEvents(
            'watch',
            {
              args: {
                to: account
              }
            },
            callback,
            true
          )
        })
        it('should not watch Mint event with opts filter', async function() {
          await watchMintEvents(
            'watch',
            {
              args: {
                to: account
              },
              opts: {
                fromBlock: 100,
                toBlock: 101
              }
            },
            callback,
            false
          )
        })
        it('should watch Mint events with opts filter', async function() {
          await watchMintEvents(
            'watch',
            {
              args: {
                to: account
              },
              opts: {
                fromBlock: 0,
                toBlock: 'latest'
              }
            },
            callback,
            true
          )
        })
      })
      describe('watchByType', function() {
        it('should watch Mint event without options', async function() {
          await watchMintEvents('watchByType', null, callback, true)
        })
        it('should watch Mint event with options ', async function() {
          await watchMintEvents('watchByType', {}, callback, true)
        })
        it('should not watch Mint event with opts filter', async function() {
          await watchMintEvents(
            'watchByType',
            {
              fromBlock: 100,
              toBlock: 101
            },
            callback,
            false
          )
        })
        it('should watch Mint events with opts filter', async function() {
          await watchMintEvents(
            'watchByType',
            {
              fromBlock: 0,
              toBlock: 'latest'
            },
            callback,
            true
          )
        })
      })
    })
    describe('GetAll', function() {
      let callback = null
      let response = null
      beforeEach(async function() {
        callback = sinon.spy((error, events) => {
          if (error) {
            throw error
          }
          response = events
        })
      })
      describe('getAll', function() {
        it('should get Mint events without options', async function() {
          await getMintEvents('getAll', null, callback, 1)
          expect(response.length).to.equal(1)
          expect(response[0].event).to.equal('Mint')
          expect(response[0].args.to).to.equal(account)
          expect(response[0].args.amount.toNumber()).to.equal(10)
        })
        it('should get Mint events with options', async function() {
          await getMintEvents('getAll', {}, callback, 1)
          expect(response.length).to.equal(1)
          expect(response[0].event).to.equal('Mint')
          expect(response[0].args.to).to.equal(account)
          expect(response[0].args.amount.toNumber()).to.equal(10)
        })
        it('should not get Mint event with args filter', async function() {
          await getMintEvents(
            'getAll',
            {
              args: {
                to: '0xebc757b8bfd562158b1bfded4e1cafe332d9845b'
              }
            },
            callback,
            1
          )
          expect(response.length).to.equal(0)
        })
        it('should get Mint event with args filter', async function() {
          await getMintEvents(
            'getAll',
            {
              args: {
                to: account
              }
            },
            callback,
            1
          )
          expect(response.length).to.equal(1)
          expect(response[0].event).to.equal('Mint')
          expect(response[0].args.to).to.equal(account)
          expect(response[0].args.amount.toNumber()).to.equal(10)
        })
        it('should not get Mint event with opts filter', async function() {
          await getMintEvents(
            'getAll',
            {
              opts: {
                fromBlock: 100,
                toBlock: 200
              }
            },
            callback,
            10
          )
          expect(response.length).to.equal(0)
        })
        it('should get Mint events with opts filter', async function() {
          await getMintEvents(
            'getAll',
            {
              opts: {
                fromBlock: 0,
                toBlock: 'latest'
              }
            },
            callback,
            10
          )
          expect(response.length).to.equal(10)
          expect(response[0].event).to.equal('Mint')
          expect(response[0].args.to).to.equal(account)
          expect(response[0].args.amount.toNumber()).to.equal(10)
        })
      })
      describe('getAllByType', function() {
        it('should get Mint event without options', async function() {
          await getMintEvents('getAllByType', null, callback, 1)
          expect(response.length).to.equal(1)
          expect(response[0].event).to.equal('Mint')
          expect(response[0].args.to).to.equal(account)
          expect(response[0].args.amount.toNumber()).to.equal(10)
        })
        it('should get Mint event with options ', async function() {
          await getMintEvents('getAllByType', {}, callback, 1)
          expect(response.length).to.equal(1)
          expect(response[0].event).to.equal('Mint')
          expect(response[0].args.to).to.equal(account)
          expect(response[0].args.amount.toNumber()).to.equal(10)
        })
        it('should not get Mint event with opts filter', async function() {
          await getMintEvents(
            'getAllByType',
            {
              fromBlock: 100,
              toBlock: 200
            },
            callback,
            10
          )
          expect(response.length).to.equal(0)
        })
        it('should get Mint events with opts filter', async function() {
          await getMintEvents(
            'getAllByType',
            {
              fromBlock: 0,
              toBlock: 'latest'
            },
            callback,
            10
          )
          expect(response.length).to.equal(10)
          expect(response[0].event).to.equal('Mint')
          expect(response[0].args.to).to.equal(account)
          expect(response[0].args.amount.toNumber()).to.equal(10)
        })
      })
    })
  })
})
