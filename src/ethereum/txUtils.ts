import { sleep } from '../utils'
import { eth } from './eth'
import { TxReceipt, TxStatus } from './wallets/Wallet'

/**
 * Some utility functions to work with Ethereum transactions.
 * @namespace
 */
export namespace txUtils {
  export let DUMMY_TX_ID: string = '0xdeadbeef'

  export let TRANSACTION_FETCH_DELAY: number = 2 * 1000

  export let TRANSACTION_STATUS = Object.freeze({
    pending: 'pending',
    confirmed: 'confirmed',
    failed: 'failed'
  })

  /**
   * Waits until the transaction finishes. Returns if it was successfull.
   * Throws if the transaction fails or if it lacks any of the supplied events
   * @param  {string} txId - Transaction id to watch
   * @param  {Array<string>|string} events - Events to watch. See {@link txUtils#getLogEvents}
   * @param  {number} [retriesOnEmpty] - Number of retries when a transaction status returns empty
   * @return {object} data - Current transaction data. See {@link txUtils#getTransaction}
   */
  export async function getConfirmedTransaction(txId: string, events: string[], retriesOnEmpty: number) {
    const tx = await waitForCompletion(txId, retriesOnEmpty)

    if (isFailure(tx)) {
      if (tx.isDropped) {
        throw new Error(`Transaction "${txId}" dropped`)
      }
      throw new Error(`Transaction "${txId}" failed`)
    }

    if (!hasLogEvents(tx, events)) {
      throw new Error(`Missing events for transaction "${txId}": ${events}`)
    }

    return tx
  }

  /**
   * Wait until a transaction finishes by either being mined or failing
   * @param  {string} txId - Transaction id to watch
   * @param  {number} [retriesOnEmpty] - Number of retries when a transaction status returns empty
   * @return {Promise<object>} data - Current transaction data. See {@link txUtils#getTransaction}
   */
  export async function waitForCompletion(txId: string, retriesOnEmpty?: number): Promise<any> {
    const isDropped = await isTxDropped(txId, retriesOnEmpty)
    if (isDropped) {
      return { hash: txId, status: TRANSACTION_STATUS.failed, isDropped: true }
    }

    while (true) {
      const tx = await getTransaction(txId)

      if (!isPending(tx) && tx.recepeit) {
        return tx
      }

      await sleep(TRANSACTION_FETCH_DELAY)
    }
  }

  /*
   * Wait retryAttemps*TRANSACTION_FETCH_DELAY for a transaction status to be in the mempool
   * @param  {string} txId - Transaction id to watch
   * @param  {number} [retryAttemps=15] - Number of retries when a transaction status returns empty
   * @return {Promise<boolean>}
   */
  export async function isTxDropped(txId: string, retryAttemps: number = 15): Promise<boolean> {
    while (retryAttemps > 0) {
      const tx = await getTransaction(txId)

      if (tx !== null) {
        return false
      }

      retryAttemps -= 1
      await sleep(TRANSACTION_FETCH_DELAY)
    }

    return true
  }

  /**
   * Get the transaction status and recepeit
   * @param  {string} txId - Transaction id
   * @return {object} data - Current transaction data. See {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethgettransaction}
   * @return {object.recepeit} transaction - Transaction recepeit
   */
  // prettier-ignore
  export async function getTransaction(txId: string): Promise<{ recepeit: TxReceipt } & TxStatus> {
    const [tx, recepeit] = await Promise.all([
      eth.wallet.getTransactionStatus(txId),
      eth.wallet.getTransactionReceipt(txId)
    ])

    return tx ? { ...tx, recepeit } : null
  }

  /**
   * Expects the result of getTransaction's geth command and returns true if the transaction is still pending.
   * It'll also check for a pending status prop against {@link txUtils#TRANSACTION_STATUS}
   * @param {object} tx - The transaction object
   * @return boolean
   */
  export function isPending(tx) {
    return tx && (tx.blockNumber === null || tx.status === TRANSACTION_STATUS.pending)
  }

  /**
   * Expects the result of getTransactionRecepeit's geth command and returns true if the transaction failed.
   * It'll also check for a failed status prop against {@link txUtils#TRANSACTION_STATUS}
   * @param {object} tx - The transaction object
   * @return boolean
   */
  export function isFailure(tx) {
    return tx && (!tx.recepeit || tx.recepeit.status === '0x0' || tx.status === TRANSACTION_STATUS.failed)
  }

  /**
   * Returns true if a transaction contains an event
   * @param {Array<object>} tx - Transaction with a decoded recepeit
   * @param {Array<string>|string} eventNames - A string or array of strings with event names you want to search for
   * @return boolean
   */
  export function hasLogEvents(tx, eventNames: string[]) {
    if (!eventNames || eventNames.length === 0) return true
    if (!tx.recepit) return false

    if (!Array.isArray(eventNames)) eventNames = [eventNames]

    return tx.recepeit.filter(log => log && log.name).every(log => eventNames.includes(log.name))
  }
}
