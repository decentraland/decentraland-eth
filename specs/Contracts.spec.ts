import { expect } from 'chai'
import { NodeConnectionFactory } from './NodeConnectionFactory'
import { deployContract } from './deployContract'
import { eth, txUtils } from '../dist'
import { MANAToken } from '../dist/contracts'

describe('ETH tests', () => {
  const nodeConnectionFactory = new NodeConnectionFactory()

  it('should return no instantiated contracts', () => {
    expect(() => eth.getContract('')).to.throw()
  })

  describe('ETH using provider', function() {
    const provider = nodeConnectionFactory.createProvider()

    it('should call .connect({}) and it works', async () => {
      const r = await eth.connect({ provider })
      expect(r).to.eq(true)
    })

    doTest()
  })

  describe('ETH using http RPC', function() {
    const provider = nodeConnectionFactory.createServer()

    it('should start the server', done => {
      provider.listen(7654, function(err) {
        done(err)
      })
    })

    it('should call .connect({}) and it works', async () => {
      const r = await eth.connect({ provider: 'http://localhost:7654' })
      expect(r).to.eq(true)
    })

    doTest()

    after(() => {
      provider.close()
    })
  })
})

function doTest() {
  it('should get the addresses', async () => {
    const account = await eth.wallet.getAccount()
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
    expect(balance.toString()).to.eq('100012300001')
  })

  it('should unlock the account', async () => {
    const accountUnlocked = await eth.wallet.unlockAccount('asdasdasd')
    console.log(`> Unlocking account status=${accountUnlocked}`)
    // tslint:disable-next-line:no-unused-expression
    expect(accountUnlocked).to.be.true
  })

  let manaAddress = '0x0'

  it('deploys a new contract', async function() {
    this.timeout(100000)
    const contract = await deployContract(eth.wallet, 'MANA', require('./fixtures/MANAToken.json'))
    console.log(`> Tx: ${contract.transactionHash}`)

    const txRecipt = await eth.wallet.getTransactionReceipt(contract.transactionHash)
    expect(typeof txRecipt.contractAddress).to.eq('string')
    expect(txRecipt.contractAddress.length).to.be.greaterThan(0)

    const x = await txUtils.getTransaction(contract.transactionHash)
    expect(typeof x).eq('object')
    expect(x.hash).eq(contract.transactionHash)
    expect(typeof x.recepeit).eq('object')

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
      const account = await eth.wallet.getAccount()
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

    eth.setContracts([fakeMANAFacade]).then(() =>
      fakeMANAFacade
        .balanceOf(address)
        .then(() => done(new Error('didnt fail')))
        .catch(() => done())
    )
  })

  it('should work with injected methods from ABI', async function() {
    this.timeout(1000000)
    const account = await eth.wallet.getAccount()
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
    }
    {
      const totalSupply = await MANAFacade.totalSupply()
      expect(totalSupply.toNumber()).eq(10)
    }
  })
}
