import { Wallet } from '../dist/ethereum/wallets/Wallet'

export type Artifact = {
  abi: any[]
  bytecode: string
}

export async function deployContract(wallet: Wallet, name: string, contract: Artifact): Promise<string> {
  const account = wallet.getAccount()
  const gasEstimate = await wallet.estimateGas({ data: contract.bytecode })
  console.log(`> Will deploy contract ${name} with gas: ${gasEstimate}`)

  const instance = wallet.createContractInstance(contract.abi)

  return new Promise((resolve, reject) => {
    instance
      .deploy({ data: contract.bytecode })
      .send({ from: account, gas: gasEstimate })
      .on('transactionHash', txHash => {
        resolve(txHash)
      })
      .on('error', err => {
        reject(err)
      })
  })
}
