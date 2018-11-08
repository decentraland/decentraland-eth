import * as path from 'path'

export class ContractFile {
  path: string
  name: string
  abi: any

  constructor(filePath: string) {
    this.path = filePath
    this.name = path.basename(filePath, path.extname(filePath))
    this.abi = this.getAbi()
  }

  isIndex() {
    return this.name === 'index'
  }

  getAbi() {
    if (this.isIndex()) return

    try {
      // TODO: avoid use of require as a function
      const Contract = require(this.path)[this.name]
      return Contract.getDefaultAbi()
    } catch (error) {
      console.log(`Could not find an artifact for "${this.path}"`, error.message)
    }
  }

  getExtensions() {
    const extensions = {}

    for (const method of this.abi) {
      const { name, inputs, stateMutability, type } = method

      switch (type) {
        case 'function': {
          const args = inputs.map(input => input.type).join(',')

          if (stateMutability === 'view' || stateMutability === 'pure') {
            if (!(name in extensions)) {
              extensions[name] = new Function(`return this.sendCall('${name}', ...arguments)`)
            }
            extensions[name][args] = new Function(`return this.sendCallByType('${name}', '${args}', ...arguments)`)
          } else if (stateMutability === 'nonpayable') {
            if (!(name in extensions)) {
              extensions[name] = new Function(`return this.sendTransaction('${name}', ...arguments)`)
            }
            extensions[name][args] = new Function(
              `return this.sendTransactionByType('${name}', '${args}', ...arguments)`
            )
          }
          break
        }
        default:
          break
      }
    }

    return extensions
  }
}
