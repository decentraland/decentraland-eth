import * as CSV from 'comma-separated-values'
import { Contract } from '../ethereum'
const { abi } = require('./artifacts/LANDRegistry.json')

const MAX_NAME_LENGTH = 50
const MAX_DESCRIPTION_LENGTH = 140

export class DataError extends Error {
  constructor(message) {
    super(message)
    this.name = 'DataError'
  }
}

/** LANDToken contract class */
export class LANDRegistry extends Contract {
  static DataError = DataError

  constructor(address: string) {
    super(address, abi)
  }

  static decodeLandData(data = '') {
    const version = data.charAt(0)
    switch (version) {
      case '0': {
        const [version, name, description, ipns] = CSV.parse(data)[0]

        return {
          version,
          // when a value is blank, csv.parse returns 0, so we fallback to empty string
          // to support stuff like `0,,,ipns:link`
          name: name || '',
          description: description || '',
          ipns: ipns || ''
        }
      }
      default:
        throw new DataError(
          `Unknown version when trying to decode land data: "${data}" (see https://github.com/decentraland/decentraland-eth/blob/master/docs/land-data.md)`
        )
    }
  }

  static encodeLandData(data: any = {}) {
    switch (data.version.toString()) {
      case '0': {
        const { version, name, description, ipns } = data
        if (name.length > MAX_NAME_LENGTH) {
          throw new DataError(`The name is too long, max length allowed is ${MAX_NAME_LENGTH} chars`)
        }
        if (description.length > MAX_DESCRIPTION_LENGTH) {
          throw new DataError(`The description is too long, max length allowed is ${MAX_DESCRIPTION_LENGTH} chars`)
        }
        return CSV.encode([[version, name, description, ipns]])
      }
      default:
        throw new DataError(
          `Unknown version when trying to encode land data: "${JSON.stringify(data)}"
          (see https://github.com/decentraland/decentraland-eth/blob/master/docs/land-data.md)`
        )
    }
  }

  getContractName() {
    return 'LANDRegistry'
  }

  async updateManyLandData(coordinates: { x: number; y: number }[], data: string) {
    const x = coordinates.map(coor => coor.x)
    const y = coordinates.map(coor => coor.y)
    return this.sendTransaction('updateManyLandData', x, y, data)
  }
}
