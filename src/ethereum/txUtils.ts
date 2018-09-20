import { eth } from './eth'
import { TransactionReceipt, TransactionStatus } from './wallets/Wallet'
import { sleep } from '../utils'

/**
 * Some utility functions to work with Ethereum transactions.
 * @namespace
 */
export namespace txUtils {
  export let DUMMY_TX_ID: string = '0xdeadbeef'

  export let TRANSACTION_FETCH_DELAY: number = 2 * 1000

  export type TransactionTypes = {
    queued: 'queued'
    dropped: 'dropped'
    replaced: 'replaced'
    pending: 'pending'
    reverted: 'reverted'
    confirmed: 'confirmed'
  }

  export let TRANSACTION_TYPES: TransactionTypes = Object.freeze({
    queued: 'queued' as 'queued',
    dropped: 'dropped' as 'dropped',
    replaced: 'replaced' as 'replaced',
    pending: 'pending' as 'pending',
    reverted: 'reverted' as 'reverted',
    confirmed: 'confirmed' as 'confirmed'
  })

  export type DroppedTransaction = {
    type: TransactionTypes['dropped']
    hash: string
    nonce: number
  }

  export type ReplacedTransaction = {
    type: TransactionTypes['replaced']
    hash: string
    nonce: number
  }

  export type QueuedTransaction = {
    type: TransactionTypes['queued']
    hash: string
    nonce: number
  }

  export type PendingTransaction = TransactionStatus & {
    type: TransactionTypes['pending']
  }

  export type RevertedTransaction = TransactionStatus & {
    type: TransactionTypes['reverted']
  }

  export type ConfirmedTransaction = TransactionStatus & {
    type: TransactionTypes['confirmed']
    receipt: TransactionReceipt
  }

  export type Transaction =
    | DroppedTransaction
    | ReplacedTransaction
    | QueuedTransaction
    | PendingTransaction
    | ConfirmedTransaction
    | RevertedTransaction

  export async function getTransaction(hash: string): Promise<Transaction> {
    const status = await eth.wallet.getTransactionStatus(hash)

    // not found
    if (status == null) {
      return null
    }

    if (status.blockNumber == null) {
      const currentNonce = await eth.getCurrentNonce()

      // replaced
      if (status.nonce < currentNonce) {
        const tx: ReplacedTransaction = {
          hash,
          type: 'replaced',
          nonce: status.nonce
        }
        return tx
      }

      // queued
      if (status.nonce > currentNonce) {
        const tx: QueuedTransaction = {
          hash,
          type: 'queued',
          nonce: status.nonce
        }
        return tx
      }

      // pending
      const tx: PendingTransaction = {
        type: 'pending',
        ...status
      }
      return tx
    }

    const receipt = await eth.wallet.getTransactionReceipt(hash)

    // reverted
    if (receipt == null || receipt.status === '0x0') {
      const tx: RevertedTransaction = {
        type: 'reverted',
        ...status
      }
      return tx
    }

    // confirmed
    const tx: ConfirmedTransaction = {
      type: 'confirmed',
      ...status,
      receipt
    }
    return tx
  }

  export async function getConfirmedTransaction(hash: string, events: string[] = []): Promise<ConfirmedTransaction> {
    while (true) {
      const tx = await getTransaction(hash)
      if (tx != null) {
        switch (tx.type) {
          case 'reverted':
          case 'dropped':
          case 'replaced':
            throw new Error(`Error: transaction ${tx.type}`)
          case 'confirmed': {
            if (!hasLogEvents(tx, events)) {
              throw new Error(`Missing events for transaction "${hash}": ${events}`)
            }
            return tx
          }
        }
      }
      await sleep(TRANSACTION_FETCH_DELAY)
    }
  }

  export function hasLogEvents(tx, eventNames: string[] = []) {
    if (!tx) return false
    if (!eventNames || eventNames.length === 0) return true
    if (!tx.recepit) return false

    if (!Array.isArray(eventNames)) eventNames = [eventNames]

    const eventsFromLogs = tx.receipt.filter(log => log && log.name).map(log => log.name)
    return eventNames.every(eventName => eventsFromLogs.includes(eventName))
  }
}
