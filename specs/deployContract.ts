import { Wallet } from '../dist/ethereum/wallets/Wallet'

export type Artifact = {
  abi: any[]
  bytecode: string
}

export async function deployContract(wallet: Wallet, name: string, contract: Artifact) {
  const account = await wallet.getAccount()

  const newContract = await wallet.getContract(contract.abi)
  const gasEstimate = await wallet.estimateGas({ data: contract.bytecode })

  console.log(`> Will deploy contract ${name} with gas: ${gasEstimate}`)

  const options = { from: account, data: contract.bytecode, gas: gasEstimate }

  let resolver = null
  let rejecter = null

  const prom = new Promise<any>((x, y) => {
    resolver = x
    rejecter = y
  })

  newContract.new(options, function(err, myContract) {
    if (err) {
      rejecter(err)
    } else {
      resolver(myContract)
    }
  })

  return prom
}
