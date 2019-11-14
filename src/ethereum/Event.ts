import { Contract } from '.'

export type WatchOptions = {
  /** Indexed return values you want to filter the logs by */
  args?: any
  /** Additional filter options, fordwarded to {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethfilter} */
  opts?: any
}

/** Event class */
export class Event {
  constructor(public contract: Contract, public name: string) {
    if (!this.instance) {
      throw new Error(`Could not find event "${name}" for ${contract.getContractName()} contract`)
    }
  }

  get instance() {
    return this.contract.instance.events[this.name]
  }

  /**
   * Register a callback for each time this event appears for the contract
   * @param  {object|function} [options] - If options is a function it'll be used as callback, ignoring the second argument
   * @param  {object} [options.args] - Indexed return values you want to filter the logs by
   * @param  {object} [options.opts] - Additional filter options, fordwarded to {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethfilter}
   * @param  {number|string} [options.fromBlock='latest'] - The number of the earliest block. latest means the most recent and pending currently mining, block
   * @param  {string} [options.address] - An address or a list of addresses to only get logs from particular account(s).
   * @param  {Array<strings>} [options.topics] - An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use null.
   * @param  {Function} callback     - Callback function for each event found
   */
  watch(callback: Function)
  watch(options: WatchOptions, callback?: Function)
  watch(options: WatchOptions | Function, callback?: Function) {
    const { args, opts } = typeof options === 'function' ? ({} as WatchOptions) : options

    let fromBlock
    let toBlock

    if (opts) {
      fromBlock = opts.fromBlock
      toBlock = opts.toBlock
      delete opts.toBlock
    }

    const func = typeof options === 'function' ? options : callback

    this.instance({ filter: args, ...opts }, (err, event) => {
      if (err) {
        func(err)
      } else {
        if ((fromBlock && event.blockNumber < fromBlock) || (toBlock && event.blockNumber > toBlock)) {
          return
        }

        func(null, event)
      }
    })
  }

  /**
   * Get all the historical events
   * @param  {object|function} [options] - If options is a function it'll be used as callback, ignoring the second argument
   * @param  {object} [options.args] - Indexed return values you want to filter the logs by
   * @param  {object} [options.opts] - Additional filter options, fordwarded to {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethfilter}
   * @param  {number|string} [options.fromBlock='latest'] - The number of the earliest block. latest means the most recent and pending currently mining, block
   * @param  {number|string} [options.toBlock='latest'] - The number of the latest block latest means the most recent and pending currently mining, block
   * @param  {string} [options.address] - An address or a list of addresses to only get logs from particular account(s).
   * @param  {Array<strings>} [options.topics] - An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use null.
   * @param  {Function} callback     - Callback function for each event found
   */
  getAll(callback?: Function)
  getAll(options: WatchOptions, callback?: Function)
  getAll(options: WatchOptions | Function, callback?: Function) {
    const { args, opts } = typeof options === 'function' ? ({} as WatchOptions) : options
    const func = typeof options === 'function' ? options : callback
    this.contract.instance
      .getPastEvents(this.name, { filter: args, ...opts })
      .then(events => {
        func(null, events)
      })
      .catch(err => {
        func(err)
      })
  }

  /**
   * Register a callback for each time this event type appears for the contract
   * @param  {object|function} [options] - If options is a function it'll be used as callback, ignoring the second argument
   * @param  {object} [options.opts] - Additional filter options, fordwarded to {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethfilter}
   * @param  {number|string} [options.fromBlock='latest'] - The number of the earliest block. latest means the most recent and pending currently mining, block
   * @param  {string} [options.address] - An address or a list of addresses to only get logs from particular account(s).
   * @param  {Array<strings>} [options.topics] - An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use null.
   * @param  {Function} callback     - Callback function for each event found
   */
  watchByType(callback: Function)
  watchByType(options: WatchOptions, callback?: Function)
  watchByType(options: WatchOptions | Function, callback?: Function) {
    const { args, opts } = typeof options === 'function' ? ({} as WatchOptions) : options

    let fromBlock
    let toBlock

    if (opts) {
      fromBlock = opts.fromBlock
      toBlock = opts.toBlock
      delete opts.toBlock
    }

    const func = typeof options === 'function' ? options : callback

    this.instance({ filter: args, ...opts }, (err, event) => {
      if (err) {
        func(err)
      } else {
        console.log(
          'condition',
          (fromBlock && event.blockNumber < fromBlock) || (toBlock && event.blockNumber > toBlock)
        )
        if ((fromBlock && event.blockNumber < fromBlock) || (toBlock && event.blockNumber > toBlock)) {
          return
        }

        func(null, event)
      }
    })
  }

  /**
   * Get all the historical events by type
   * @param  {object|function} [options] - If options is a function it'll be used as callback, ignoring the second argument
   * @param  {object} [options.opts] - Additional filter options, fordwarded to {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethfilter}
   * @param  {number|string} [options.fromBlock='latest'] - The number of the earliest block. latest means the most recent and pending currently mining, block
   * @param  {number|string} [options.toBlock='latest'] - The number of the latest block latest means the most recent and pending currently mining, block
   * @param  {string} [options.address] - An address or a list of addresses to only get logs from particular account(s).
   * @param  {Array<strings>} [options.topics] - An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use null.
   * @param  {Function} callback     - Callback function for each event found
   */
  getAllByType(callback?: Function)
  getAllByType(options: WatchOptions, callback?: Function)
  getAllByType(options: WatchOptions | Function, callback?: Function) {
    const opts = typeof options === 'function' ? ({} as WatchOptions) : options
    const func = typeof options === 'function' ? options : callback
    this.contract.instance
      .getPastEvents(this.name, opts as any)
      .then(events => {
        func(null, events)
      })
      .catch(err => {
        func(err)
      })
  }
}
