import { Wallet } from '../dist/ethereum/wallets/Wallet'
import { future } from 'eth-connect/dist/utils/future'
import { Contract } from '../dist'

export type Artifact = {
  abi: any[]
  bytecode: string
}

export async function deployContract<T extends Contract & { transactionHash: string }>(
  wallet: Wallet,
  name: string,
  contract: Artifact
) {
  const account = await wallet.getAccount()

  const newContract = await wallet.getContract(contract.abi)
  const gasEstimate = await wallet.estimateGas({ data: contract.bytecode })

  console.log(`> Will deploy contract ${name} with gas: ${gasEstimate}`)

  const options = { from: account, data: contract.bytecode, gas: gasEstimate }

  const contractFuture = future<T>()

  newContract.new(options, function(err, myContract) {
    if (err) {
      contractFuture.reject(err)
    } else {
      contractFuture.resolve(myContract)
    }
  })

  return contractFuture
}
