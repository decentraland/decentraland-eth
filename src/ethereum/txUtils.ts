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
    failed: 'failed',
    dropped: 'dropped'
  })

  export type MinedTransaction = { receipt: TxReceipt } & TxStatus
  export type DroppedTransaction = { status: string; hash: string }

  export class DroppedTransactionError extends Error {
    public tx: DroppedTransaction
    public dropped = true
    public status = TRANSACTION_STATUS.dropped
    constructor(tx: DroppedTransaction, message?: string) {
      super(message) // 'Error' breaks prototype chain here
      this.tx = tx
      Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain
    }
  }

  export class FailedTransactionError extends Error {
    public tx: MinedTransaction
    public failed: boolean = true
    public status: string = TRANSACTION_STATUS.failed
    constructor(tx: MinedTransaction, message?: string) {
      super(message) // 'Error' breaks prototype chain here
      this.tx = tx
      Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain
    }
  }

  /**
   * Waits until the transaction finishes. Returns if it was successfull.
   * Throws if the transaction fails or if it lacks any of the supplied events
   * @param  {string} txId - Transaction id to watch
   * @param  {Array<string>|string} events - Events to watch. See {@link txUtils#getLogEvents}
   * @param  {number} [retriesOnEmpty] - Number of retries when a transaction status returns empty
   * @return {object} data - Current transaction data. See {@link txUtils#getTransaction}
   */
  export async function getConfirmedTransaction(txId: string, events: string[], retriesOnEmpty?: number) {
    const tx = await waitForCompletion(txId, retriesOnEmpty)

    if (!tx) {
      throw new Error(`Transaction "${txId}" falsy: ${tx}`)
    }

    if (isDropped(tx)) {
      throw new DroppedTransactionError(tx as DroppedTransaction, `Transaction "${txId}" dropped`)
    }

    if (isFailure(tx)) {
      throw new FailedTransactionError(tx as MinedTransaction, `Transaction "${txId}" failed`)
    }

    if (!hasLogEvents(tx, events)) {
      throw new Error(`Missing events for transaction "${txId}": ${events}`)
    }

    return tx
  }

  /**
   * Wait until a transaction finishes by either being mined or failing
   * @param  {string} txId - Transaction id to watch
   * @param  {number} [retriesOnEmpty] - Number of retries when a transaction status returns empty, if not provided it will retry indefinitely
   * @return {Promise<object>} data - Current transaction data. See {@link txUtils#getTransaction}
   */
  export async function waitForCompletion(
    txId: string,
    retriesOnEmpty?: number
  ): Promise<MinedTransaction | DroppedTransaction> {
    let retries = 0
    while (true) {
      const tx = await getTransaction(txId)

      if (tx && !isPending(tx) && tx.receipt) {
        if (isFailure(tx)) {
          return { ...tx, status: TRANSACTION_STATUS.failed }
        } else {
          return { ...tx, status: TRANSACTION_STATUS.confirmed }
        }
      }

      retries++
      if (!isNaN(retriesOnEmpty) && retries > retriesOnEmpty) {
        return { hash: txId, status: TRANSACTION_STATUS.dropped }
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
   * Get the transaction status and receipt
   * @param  {string} txId - Transaction id
   * @return {object} data - Current transaction data. See {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethgettransaction}
   * @return {object.receipt} transaction - Transaction receipt
   */
  // prettier-ignore
  export async function getTransaction(txId: string): Promise<MinedTransaction> {
    const [tx, receipt] = await Promise.all([
      eth.wallet.getTransactionStatus(txId),
      eth.wallet.getTransactionReceipt(txId)
    ])

    return tx ? { ...tx, receipt } : null
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
   * Expects the result of getTransactionReceipt's geth command and returns true if the transaction failed.
   * It'll also check for a failed status prop against {@link txUtils#TRANSACTION_STATUS}
   * @param {object} tx - The transaction object
   * @return boolean
   */
  export function isFailure(tx) {
    return tx && (!tx.receipt || tx.receipt.status === '0x0' || tx.status === TRANSACTION_STATUS.failed)
  }

  /**
   * Checks for a dropped status prop against {@link txUtils#TRANSACTION_STATUS}
   * @param {object} tx - The transaction object
   * @return boolean
   */
  export function isDropped(tx) {
    return tx && tx.status === TRANSACTION_STATUS.dropped
  }

  /**
   * Returns true if a transaction contains an event
   * @param {Array<object>} tx - Transaction with a decoded receipt
   * @param {Array<string>|string} eventNames - A string or array of strings with event names you want to search for
   * @return boolean
   */
  export function hasLogEvents(tx, eventNames: string[]) {
    if (!eventNames || eventNames.length === 0) return true
    if (!tx.recepit) return false

    if (!Array.isArray(eventNames)) eventNames = [eventNames]

    return tx.receipt.filter(log => log && log.name).every(log => eventNames.includes(log.name))
  }
}
