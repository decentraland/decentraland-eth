import { expect } from 'chai'
import { eth, txUtils } from '../dist'
import { MANAToken } from '../dist/contracts'

const MainnetMANAAddress = '0x0f5d2fb29fb7d3cfee444a200298f468908cc942'
const mainnetFailedTransaction = '0x8f9369340bcd100b260a872b34e79f7b441e694db89c533310a77458d264fe18'
const mainnetInvalidTransaction = '0x1231231212312312123123121231231212312312123123121231231212312312'
const mainnetValidTransaction = '0xd8d05c253a8959486524e31ba5664905b803ad24550befc119d9ba56d204bb28'

describe('ETH using url provider (mainnet)', function() {
  const provider = 'https://mainnet.infura.io'

  it('should call .connect({}) and it works', async function() {
    this.timeout(10000)
    const r = await eth.connect({ provider })
    console.log('connected')
    expect(r).to.eq(true)
  })

  it('should throw trying to get an address', () => {
    expect(() => eth.getAddress()).to.throw()
  })

  let MANAFacade: MANAToken

  it('instantiates a mana contract', async function() {
    this.timeout(10000)

    MANAFacade = new MANAToken(MainnetMANAAddress)

    await eth.setContracts([MANAFacade])

    expect(MANAFacade.instance).to.not.eq(null)
  })

  it('should get 0 mana balance by default', async function() {
    this.timeout(10000)
    {
      const balance = await MANAFacade.balanceOf(MainnetMANAAddress)
      expect(balance.toString()).not.eq('0')
      expect(typeof balance).eq('number')
    }
    {
      const balance = await MANAFacade.balanceOf('0x123')
      expect(balance.toString()).eq('0')
    }
  })

  it('should fail by invoking an unexistent method', async function() {
    this.timeout(10000)
    expect(() => MANAFacade.sendCall('asdasd')).to.throw()
  })

  it('should return null if the tx hash is invalid', async function() {
    this.timeout(30000)
    const invalidTx = await txUtils.getTransaction(mainnetInvalidTransaction)
    expect(invalidTx).to.be.equal(null)
  })

  it('should work and identify reverted transactions', async function() {
    this.timeout(30000)
    /* tslint:disable-next-line:no-unnecessary-type-assertion */
    const failedTx = (await txUtils.getTransaction(mainnetFailedTransaction)) as txUtils.RevertedTransaction

    expect(failedTx.type).to.be.equal('reverted')
  })

  it('should get the status of a transaction', async function() {
    this.timeout(10000)
    const successTx = await txUtils.getTransaction(mainnetValidTransaction)
    expect(successTx.hash).to.eq(mainnetValidTransaction)
  })
})
