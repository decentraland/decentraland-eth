import { Contract } from '..'

/**
 * This class decorator adds the missing methods to the prototype of a class
 * @param contract abi of the contract
 */
export function fulfillContractMethods(instance: Contract, abi: any[]) {
  for (const method of abi) {
    const { name, stateMutability, type } = method

    if (!(name in instance)) {
      switch (type) {
        case 'function': {
          if (stateMutability === 'view') {
            instance[name] = new Function(`return this.sendCall('${name}', ...arguments)`)
          } else if (stateMutability === 'nonpayable') {
            instance[name] = new Function(`return this.sendTransaction('${name}', ...arguments)`)
          }
          break
        }
      }
    }
  }
}
