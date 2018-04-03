import { expect } from 'chai'
import { eth } from '../dist'
const ganache = require('ganache-cli')

describe('ETH', function() {
  const server = ganache.server()

  it('should start ganache server', done => {
    server.listen(8080, function(err, blockchain) {
      done(err)
    })
  })

  it('should return no instantiated contracts', () => {
    expect(() => eth.getContract('')).to.throw()
  })

  it('should call .connect({}) and it works', async () => {
    const r = await eth.connect({
      providerUrl: 'http://localhost:8080'
    })
    expect(r).to.eq(true)
  })

  it('should call .connect({}) and it works (again)', async () => {
    const r = await eth.connect({ providerUrl: 'http://localhost:8080' })
    expect(r).to.eq(true)
  })

  after(() => {
    server.close()
  })
})
