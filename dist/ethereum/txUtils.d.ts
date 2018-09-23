import { TransactionReceipt, TransactionStatus } from './wallets/Wallet';
/**
 * Some utility functions to work with Ethereum transactions.
 * @namespace
 */
export declare namespace txUtils {
    let DUMMY_TX_ID: string;
    let TRANSACTION_FETCH_DELAY: number;
    type TransactionTypes = {
        queued: 'queued';
        dropped: 'dropped';
        replaced: 'replaced';
        pending: 'pending';
        reverted: 'reverted';
        confirmed: 'confirmed';
    };
    let TRANSACTION_TYPES: TransactionTypes;
    type DroppedTransaction = {
        type: TransactionTypes['dropped'];
        hash: string;
        nonce: number;
    };
    type ReplacedTransaction = {
        type: TransactionTypes['replaced'];
        hash: string;
        nonce: number;
    };
    type QueuedTransaction = {
        type: TransactionTypes['queued'];
        hash: string;
        nonce: number;
    };
    type PendingTransaction = TransactionStatus & {
        type: TransactionTypes['pending'];
    };
    type RevertedTransaction = TransactionStatus & {
        type: TransactionTypes['reverted'];
    };
    type ConfirmedTransaction = TransactionStatus & {
        type: TransactionTypes['confirmed'];
        receipt: TransactionReceipt;
    };
    type Transaction = DroppedTransaction | ReplacedTransaction | QueuedTransaction | PendingTransaction | ConfirmedTransaction | RevertedTransaction;
    function getTransaction(hash: string): Promise<Transaction>;
    function getConfirmedTransaction(hash: string, events?: string[]): Promise<ConfirmedTransaction>;
    function hasLogEvents(tx: any, eventNames?: string[]): boolean;
}
