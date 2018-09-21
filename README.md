![](https://raw.githubusercontent.com/decentraland/web/gh-pages/img/decentraland.ico)

# Ethereum Commons [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# Ethereum

Set of utility functions to work with the Ethereum blockchain.

Calling `eth.connect()` should be enough to get you going. If you want to customize this this behaviour, you can check the breakdown below.

Implementations for all important Decentraland contracts live on the `/contracts` folder. An example of its use can be found below.

### index.js

Main API to interface with web3. Acts as a global singleton and must be connected before calling any other method

```javascript
import { eth } from 'ethereum'
import { Contract } from 'Contract'

const abi = [
  {
    name: 'method',
    type: 'function'
  }
]

class SuperTokenContract extends Contract {
  constructor(address: string) {
    super(address, abi)
  }
}

const superTokenContract = new SuperTokenContract('0xdeadbeeffaceb00c')

eth.connect({
  contracts: [superTokenContract]
})

eth.fetchTxStatus('TX_HASH')
```

### Contract

An interface to work with Ethereum contracts, takes care of decoding contract data and of calls/transactions.

```javascript
import { Contract } from 'Contract'
import { abi } from './abis/MANAToken.json'

const contract = new Contract('0xdeadbeef', abi)

await contract.sendCall('allowance', sender, receiver)
await contract.transaction('lockMana', manaValue)
```

### txUtils.js

A set of common utility functions to work with transactions

```javascript
import { txUtils } from 'decentraland-eth'

const status = eth.fetchTxStatus('TX_HASH')

if (txUtils.isPending(status)) {
  // something
}
```

## Putting it all together

The idea is to define your own `Contract`s and work with them using `eth`. A typical case is described below:

_MANAToken.js_

```javascript
import { eth } from 'decentraland-eth'
import { abi } from './artifacts/MANAToken.json'

class MANAToken extends eth.Contract {
  constructor(address: string) {
    super(address, abi)
  }

  async lockMana(sender, mana) {
    return await this.transaction('lockMana', sender, mana, { gas: 120000 })
  }
}

export default MANAToken
```

_On the start of your app, maybe server.js_

```javascript
import { eth, contracts } from 'decentraland-eth'

const manaToken = new contracts.MANAToken('0xdeadbeef' /*address*/)

eth.connect({
  contracts: [
    manaToken
    // ...etc
  ]
})

manaToken.lockMana()
```

### Scripts

**build**

Build the lib for use

**lint**

Lint TS files with `tslint` and DCL linter rules

**docs**

Builds an static page with the JSDoc documentation

**test**

Run tests using mocha and chai

### Release

We use [semantic-release](https://github.com/semantic-release/semantic-release) to automate the release process of this package. Every time we merge to `master`, the CI will run `semantic-release` and it will publish a new version of the package. It will determine the next version of the package and it will generate release notes from the commit messages. That's why we enforce the following format for commit messages:

```
type: message
```

or

```
type(scope): messages
```

for example

```
feature(Map): added zoom levels
```

We use [husky](https://github.com/typicode/husky) and [validate-commit-msg](https://www.npmjs.com/package/validate-commit-msg) to enforce this format on every commit.

### Continuous Deployment

If you have decentraland-eth as a dependency and you're deploying to a Linux system, you might run into an error like this one: [commit 2dd8319 on CircleCI](https://circleci.com/gh/decentraland/decentraland-eth/186?utm_campaign=vcs-integration-link&utm_medium=referral&utm_source=github-build-link).

The error comes from the installation of [`node-hid`](https://github.com/node-hid/node-hid), you need to have `libusb` available for it to work, and it's not present in all Linux systems.

You can see an example of a fix in this repos [`config.yml`](https://github.com/decentraland/decentraland-eth/blob/master/.circleci/config.yml) file.

[`node-hid`](https://github.com/node-hid/node-hid) is a dependency of [`ledgerco`](https://github.com/LedgerHQ/ledgerjs), which in turn is a dependency of [`ledger-wallet-provider`](https://github.com/Neufund/ledger-wallet-provider), used by this lib.

.
