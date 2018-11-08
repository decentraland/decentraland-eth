import { Contract } from '..'

export type ABIMethod = any

/**
 * This class decorator adds the missing methods to the prototype of a class
 * @param contract abi of the contract
 */
export function fulfillContractMethods(instance: Contract, abi: ABIMethod[]) {
  const namesToSet = new Map<string, ABIMethod[]>()

  for (const method of abi) {
    const { name, type } = method

    if (type !== 'function') continue

    const proto = Object.getPrototypeOf(instance)

    if (name in proto && typeof proto[name] === 'function') {
      // Some contract classes as MANAToken has predefined methods.
      // we should not override them
      continue
    }

    if (!namesToSet.has(name)) {
      namesToSet.set(name, [])
    }

    const addToList = namesToSet.get(name)

    addToList.push(method)
  }

  namesToSet.forEach((methodList, name) => {
    if (methodList.length === 1) {
      const method = methodList[0]
      const args = method.inputs.map(input => input.type).join(',')
      instance[name] = createMethod(instance, method, args)
    } else {
      instance[name] = fullfilOverloadedMethod(name, methodList)
    }

    methodList.forEach(method => {
      const args = method.inputs.map(input => input.type).join(',')
      instance[name][args] = createMethod(instance, method, args)
    })
  })
}

function createMethod(instance: Contract, method: ABIMethod, args: string) {
  const { name, stateMutability, type } = method

  switch (type) {
    case 'function': {
      if (stateMutability === 'view' || stateMutability === 'pure') {
        return function() {
          return instance.sendCallByType(name, args, ...arguments)
        }
      } else if (stateMutability === 'nonpayable') {
        return function() {
          return instance.sendTransactionByType(name, args, ...arguments)
        }
      }
      break
    }
  }

  throw new Error(`Method: ${name} is not a function`)
}

function fullfilOverloadedMethod(name: string, methodList: ABIMethod[]) {
  const availableMethods = methodList
    .map(method => method.inputs.map(input => input.type).join(','))
    .map(args => `contract.${name}[${JSON.stringify(args)}](...)`)
    .join(', ')

  return function() {
    throw new Error(`Method: ${name} is overloaded. Options available are: ${availableMethods}`)
  }
}
