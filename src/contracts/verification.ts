import { Contract } from '..'

export type ABIMethod = any

/**
 * This class decorator adds the missing methods to the prototype of a class
 * @param contract abi of the contract
 */
export function fulfillContractMethods(instance: Contract, abi: ABIMethod[]) {
  const namesToSet = new Map<string, ABIMethod[]>()
  console.log(instance)

  for (const method of abi) {
    const { name } = method

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
      instance[name] = createMethod(instance, methodList[0])
    } else {
      instance[name] = fullfilOverloadedMethod(name, methodList)
    }
  })

  console.log(instance)
}

function createMethod(instance: Contract, method: ABIMethod, args?: string) {
  const { name, stateMutability, type } = method

  switch (type) {
    case 'function': {
      if (stateMutability === 'view' || stateMutability === 'pure') {
        if (args) {
          return function() {
            return instance.sendCallByType(name, args, ...arguments)
          }
        } else {
          return function() {
            return instance.sendCall(name, ...arguments)
          }
        }
      } else if (stateMutability === 'nonpayable') {
        if (args) {
          return function() {
            return instance.sendTransactionByType(name, args, ...arguments)
          }
        } else {
          return function() {
            return instance.sendTransaction(name, ...arguments)
          }
        }
      }
      break
    }
  }
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
