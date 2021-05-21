"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eth_1 = require("./eth");
const ethereumJsUtil = require("ethereumjs-util");
/**
 * Work with signatures made with Ethereum wallets
 */
class SignedMessage {
    constructor(message, signature) {
        this.message = message;
        this.signature = signature;
        if (!message || !signature) {
            throw new Error('You need to supply a message and a signature');
        }
    }
    /**
     * Decodes the message for the given signature
     * @return {string} address - Address which signed the message
     */
    getAddress() {
        const decodedMessage = this.decodeMessage();
        const { v, r, s } = this.decodeSignature();
        const pubkey = ethereumJsUtil.ecrecover(ethereumJsUtil.hashPersonalMessage(decodedMessage), v, r, s);
        return '0x' + eth_1.eth.utils.pubToAddressHex(pubkey);
    }
    /**
     * Decodes the signed message so it's ready to be stringified
     * @return {Buffer} - Buffer containing the decoded message
     */
    decodeMessage() {
        return new Buffer(this.message.substr(2), 'hex');
    }
    /**
     * Decodes the signature of a message
     */
    decodeSignature() {
        return ethereumJsUtil.fromRpcSig(this.signature.substr(2));
    }
    /**
     * Extract values from a signed message.
     * This function expects a particular message structure which looks like this:
     * @example
     * Header title
     * propery1: value1
     * propery2: value2
     * ...etc
     * @param  {Array<string>|string} property - Property name or names to find
     * @return {Array<string>} - The found values or null for each of the supplied properties
     */
    extract(properties) {
        if (!Array.isArray(properties))
            properties = [properties];
        const message = this.decodeMessage().toString();
        const result = [];
        properties.map(property => {
            const regexp = new RegExp(`^${property}:\\s(.*)$`, 'gim');
            const match = regexp.exec(message);
            const value = match && match[1];
            result.push(value);
        });
        return result;
    }
}
exports.SignedMessage = SignedMessage;
//# sourceMappingURL=SignedMessage.js.map