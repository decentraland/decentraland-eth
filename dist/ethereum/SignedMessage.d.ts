/// <reference types="node" />
/**
 * Work with signatures made with Ethereum wallets
 */
export declare class SignedMessage {
    message: string;
    signature: string;
    constructor(message: string, signature: string);
    /**
     * Decodes the message for the given signature
     * @return {string} address - Address which signed the message
     */
    getAddress(): string;
    /**
     * Decodes the signed message so it's ready to be stringified
     * @return {Buffer} - Buffer containing the decoded message
     */
    decodeMessage(): Buffer;
    /**
     * Decodes the signature of a message
     */
    decodeSignature(): any;
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
    extract(properties: string[] | string): string[];
}
