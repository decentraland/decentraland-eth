import { expect } from 'chai'
import { NodeConnectionFactory } from './NodeConnectionFactory'
import { deployContract } from './deployContract'
import { eth, txUtils } from '../dist'
import { MANAToken } from '../dist/contracts'
import { MANAToken as MANATokenOverloaded } from './MANAToken'

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

  describe('Transactions', function() {
    let deployedMANAAddress = '0x0'
    let MANAFacade: MANAToken
    let account = '0x0'
    let tenWei = eth.utils.toWei(10)

    beforeEach(async () => {
      const nodeConnectionFactory = new NodeConnectionFactory()
      const provider = nodeConnectionFactory.createProvider()
      await eth.connect({ provider })

      const contract = await deployContract(eth.wallet, 'MANA', require('./fixtures/MANAToken.json'))
      const txRecipt = await eth.wallet.getTransactionReceipt(contract.transactionHash)
      deployedMANAAddress = txRecipt.contractAddress

      MANAFacade = new MANATokenOverloaded(deployedMANAAddress)
      await eth.setContracts([MANAFacade])
      account = await eth.wallet.getAccount()
    })

    describe('Call', function() {
      it('should send call by method name', async function() {
        await MANAFacade.mint(account, tenWei)
        const balance = await MANAFacade.balanceOf(account)
        expect(balance).equal(10)
      })

      it('should send call by sendCall', async function() {
        await MANAFacade.mint(account, tenWei)
        const balance = await MANAFacade.sendCall('balanceOf', account)
        expect(balance.toString()).equal(tenWei.toString())
      })

      it('should send call by sendCallByType', function() {
        let fakeBalanceOf = MANAFacade.sendCallByType('fakeBalanceOf', 'address,address')
        expect('then' in fakeBalanceOf).eq(true, 'The injected methods should be thenable')

        fakeBalanceOf = MANAFacade.sendCallByType('fakeBalanceOf', 'address')
        expect('then' in fakeBalanceOf).eq(true, 'The injected methods should be thenable')
      })

      it('should call overloaded method', function() {
        expect(typeof MANAFacade['fakeBalanceOf']['address,address']).equal('function')
        expect(typeof MANAFacade['fakeBalanceOf']['address']).equal('function')
      })

      it('throws when try to call overloaded method', async function() {
        expect(() => MANAFacade['fakeBalanceOf'](account)).to.throw(
          'Method: fakeBalanceOf is overloaded. Options available are: contract.fakeBalanceOf["address,address"](...), contract.fakeBalanceOf["address"](...)'
        )
      })
    })

    describe('Send Transaction', function() {
      it('should send transaction by method name', async function() {
        await MANAFacade.mint(account, tenWei)
        const balance = await MANAFacade.balanceOf(account)
        expect(balance).equal(10)
      })

      it('should send transaction by sendTransaction', async function() {
        await MANAFacade.sendTransaction('mint', account, tenWei)
        const balance = await MANAFacade.balanceOf(account)
        expect(balance).equal(10)
      })

      it('should send transaction by sendTransactionByType', async function() {
        await MANAFacade.sendTransactionByType('mint', 'address,uint256', account, tenWei)
        const balance = await MANAFacade.balanceOf(account)
        expect(balance).equal(10)
      })

      it('should send transaction by sendTransactionByType', function() {
        let fakeMint = MANAFacade.sendTransactionByType('fakeMint', 'address,uint256')
        expect('then' in fakeMint).eq(true, 'The injected methods should be thenable')

        fakeMint = MANAFacade.sendTransactionByType('fakeMint', 'address,uint256,address')
        expect('then' in fakeMint).eq(true, 'The injected methods should be thenable')
      })

      it('should call overloaded method', function() {
        expect(typeof MANAFacade['fakeMint']['address,uint256']).equal('function')
        expect(typeof MANAFacade['fakeMint']['address,uint256,address']).equal('function')
      })

      it('throws when try to call overloaded method', function() {
        expect(() => MANAFacade['fakeMint'](account, tenWei)).to.throw(
          'Method: fakeMint is overloaded. Options available are: contract.fakeMint["address,uint256,address"](...), contract.fakeMint["address,uint256"](...)'
        )
      })
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

    /* tslint:disable-next-line:no-unnecessary-type-assertion */
    const x = (await txUtils.getTransaction(contract.transactionHash)) as txUtils.ConfirmedTransaction
    expect(typeof x).eq('object')
    expect(x.hash).eq(contract.transactionHash)
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
