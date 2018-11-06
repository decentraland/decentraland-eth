import { Contract } from '..'

/**
 * This class decorator adds the missing methods to the prototype of a class
 * @param contract abi of the contract
 */
export function fulfillContractMethods(instance: Contract, abi: any[]) {
  for (const method of abi) {
    const { name, stateMutability, type, inputs } = method
    const args = inputs.map(input => input.type).join(',')

    switch (type) {
      case 'function': {
        if (stateMutability === 'view' || stateMutability === 'pure') {
          if (!(name in instance)) {
            instance[name] = new Function(`return this.sendCall('${name}', ...arguments)`)
          }
          instance[name][args] = new Function(`return this.sendCallByType('${name}', '${args}', ...arguments)`)
        } else if (stateMutability === 'nonpayable') {
          if (!(name in instance)) {
            instance[name] = new Function(`return this.sendTransaction('${name}', ...arguments)`)
          }
          instance[name][args] = new Function(`return this.sendTransactionByType('${name}', '${args}', ...arguments)`)
        }
        break
      }
    }
  }
}
