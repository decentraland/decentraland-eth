import { expect } from 'chai'
import { deployContract } from './deployContract'
import { eth, txUtils } from '../dist'
import { MANAToken } from '../dist/contracts'
import { testGeth } from './helpers'

describe('ETH tests (geth)', () => {
  it('should return no instantiated contracts', () => {
    expect(() => eth.getContract('')).to.throw()
  })

  testGeth(provider => {
    it('should call .connect({}) and it works', async () => {
      const r = await eth.connect({ provider })
      expect(r).to.eq(true)
    })

    doTest()
  })
})

function doTest() {
  it('should get the addresses', async () => {
    const account = eth.wallet.getAccount()
    console.log(`> Using account ${account}`)
    // tslint:disable-next-line:no-unused-expression
    expect(account).to.be.string
    expect(account.length).to.gt(0)
  })

  it('should get the network', async () => {
    // this should not fail, that's all
    await eth.getNetwork()
  })

  it('should get the balance', async () => {
    const coinbase = await eth.wallet.getCoinbase()
    console.log(`> Coinbase`, coinbase)
    const balance = await eth.wallet.getBalance(coinbase)
    console.log(`> Balance ${balance}`)
    expect(balance.toNumber()).to.be.gt(0)
  })

  it('should unlock the account', async () => {
    const accountUnlocked = await eth.wallet.unlockAccount(undefined)
    console.log(`> Unlocking account status=${accountUnlocked}`)
    // tslint:disable-next-line:no-unused-expression
    expect(accountUnlocked).to.be.true
  })

  it('should sign a string with the unlocked account', async () => {
    const messageToSign = '0x' + (Math.abs(Math.random() * 0x7fffffff) | 0).toString(16)
    console.log(`> Signed message ${messageToSign}`)
    const signature = await eth.wallet.sign(messageToSign)
    console.log(`> Signature ${signature}`)
    const publicKey = eth.wallet.getAccount()

    expect(await eth.wallet.recover(messageToSign, signature)).to.eq(publicKey)
  })

  let manaAddress = '0x0'

  it('deploys a new contract', async function() {
    this.timeout(100000)
    const transactionHash = await deployContract(eth.wallet, 'MANA', require('./fixtures/MANAToken.json'))
    console.log(`> Tx: ${transactionHash}`)

    const tx = await txUtils.getTransaction(transactionHash)

    expect(tx.type).to.eq('confirmed')

    const txRecipt = await eth.wallet.getTransactionReceipt(transactionHash)
    expect(typeof txRecipt.contractAddress).to.eq('string')
    expect(txRecipt.contractAddress.length).to.be.greaterThan(0)

    /* tslint:disable-next-line:no-unnecessary-type-assertion */
    const x = (await txUtils.getTransaction(transactionHash)) as txUtils.ConfirmedTransaction
    expect(typeof x).eq('object')
    expect(x.hash).eq(transactionHash)
    expect(typeof x.receipt).eq('object')

    manaAddress = txRecipt.contractAddress
  })

  let MANAFacade: MANAToken

  it('instantiates a mana contract', async function() {
    MANAFacade = new MANAToken(manaAddress)

    await eth.setContracts([MANAFacade])

    expect(MANAFacade.instance).to.not.eq(null)
  })

  it('should get 0 mana balance by default', async () => {
    {
      const account = eth.wallet.getAccount()
      const balance = await MANAFacade.balanceOf(account)
      expect(balance.toString()).eq('0')
      expect(typeof balance).eq('number')
    }
    {
      const balance = await MANAFacade.balanceOf('0x0')
      expect(balance.toString()).eq('0')
    }
  })

  it('should fail by invoking an unexistent method', async () => {
    expect(() => MANAFacade.sendCall('asdasd')).to.throw()
  })

  it('should fail by pointing to a contract to wrong address', function(done) {
    this.timeout(100000)

    const address = '0x0'
    const fakeMANAFacade = new MANAToken(address)

    eth
      .setContracts([fakeMANAFacade])
      .then(() => fakeMANAFacade.balanceOf(address))
      .then(() => done(new Error('didnt fail')))
      .catch(() => done())
  })

  it('should work with injected methods from ABI', async function() {
    this.timeout(1000000)
    const account = eth.wallet.getAccount()
    {
      const mintingFinished = MANAFacade.mintingFinished()
      expect('then' in mintingFinished).eq(true, 'The injected methods should be thenable')

      const result = await mintingFinished
      expect(typeof result).eq('boolean', 'mintingFinished should return a boolean')
    }
    {
      const totalSupply = await MANAFacade.totalSupply()
      expect(totalSupply.toNumber()).eq(0)
    }
    {
      const mintResult = await MANAFacade.mint(account, 10)
      expect(typeof mintResult).eq('string')

      while (true) {
        const tx = await txUtils.getTransaction(mintResult)
        if (tx.type !== 'pending') {
          expect(tx.type).to.eq('confirmed', 'process mint transaction')
          break
        }
      }
    }
    {
      const totalSupply = await MANAFacade.totalSupply()
      expect(totalSupply.toNumber()).eq(10)
    }
  })
}
