/**
 * This class decorator adds the missing methods to the prototype of a class
 * @param contract abi of the contract
 */
export function CompleteContractMethods(abi: any[]) {
  return function(klass) {
    const prototype = klass.prototype

    for (const method of abi) {
      const { name, stateMutability, type } = method

      if (name in prototype) {
        switch (type) {
          case 'function': {
            if (stateMutability === 'view') {
              prototype[name] = new Function(`return this.call('${name}', ...arguments)`)
            } else if (stateMutability === 'nonpayable') {
              prototype[name] = new Function(`return this.transaction('${name}', ...arguments)`)
            }
            break
          }
        }
      }
    }

    return klass
  }
}
