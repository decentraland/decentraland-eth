"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eth_1 = require("./eth");
const utils_1 = require("../utils");
/**
 * Some utility functions to work with Ethereum transactions.
 * @namespace
 */
var txUtils;
(function (txUtils) {
    txUtils.DUMMY_TX_ID = '0xdeadbeef';
    txUtils.TRANSACTION_FETCH_DELAY = 2 * 1000;
    txUtils.TRANSACTION_TYPES = Object.freeze({
        queued: 'queued',
        dropped: 'dropped',
        replaced: 'replaced',
        pending: 'pending',
        reverted: 'reverted',
        confirmed: 'confirmed'
    });
    async function getTransaction(hash) {
        const status = await eth_1.eth.wallet.getTransactionStatus(hash);
        // not found
        if (status == null) {
            return null;
        }
        if (status.blockNumber == null) {
            const currentNonce = await eth_1.eth.getCurrentNonce();
            // replaced
            if (status.nonce < currentNonce) {
                const tx = {
                    hash,
                    type: 'replaced',
                    nonce: status.nonce
                };
                return tx;
            }
            // queued
            if (status.nonce > currentNonce) {
                const tx = {
                    hash,
                    type: 'queued',
                    nonce: status.nonce
                };
                return tx;
            }
            // pending
            const tx = Object.assign({ type: 'pending' }, status);
            return tx;
        }
        const receipt = await eth_1.eth.wallet.getTransactionReceipt(hash);
        // reverted
        if (receipt == null || receipt.status === '0x0') {
            const tx = Object.assign({ type: 'reverted' }, status);
            return tx;
        }
        // confirmed
        const tx = Object.assign({ type: 'confirmed' }, status, { receipt });
        return tx;
    }
    txUtils.getTransaction = getTransaction;
    async function getConfirmedTransaction(hash, events = []) {
        while (true) {
            const tx = await getTransaction(hash);
            if (tx != null) {
                switch (tx.type) {
                    case 'reverted':
                    case 'dropped':
                    case 'replaced':
                        throw new Error(`Error: transaction ${tx.type}`);
                    case 'confirmed': {
                        if (!hasLogEvents(tx, events)) {
                            throw new Error(`Missing events for transaction "${hash}": ${events}`);
                        }
                        return tx;
                    }
                }
            }
            await utils_1.sleep(txUtils.TRANSACTION_FETCH_DELAY);
        }
    }
    txUtils.getConfirmedTransaction = getConfirmedTransaction;
    function hasLogEvents(tx, eventNames = []) {
        if (!tx)
            return false;
        if (!eventNames || eventNames.length === 0)
            return true;
        if (!tx.recepit)
            return false;
        if (!Array.isArray(eventNames))
            eventNames = [eventNames];
        const eventsFromLogs = tx.receipt.filter(log => log && log.name).map(log => log.name);
        return eventNames.every(eventName => eventsFromLogs.includes(eventName));
    }
    txUtils.hasLogEvents = hasLogEvents;
})(txUtils = exports.txUtils || (exports.txUtils = {}));
//# sourceMappingURL=txUtils.js.map