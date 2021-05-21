"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abi_decoder_1 = require("./abi-decoder");
const abi = {
    /**
     * Get the contract events
     * @return {Array<string>} - events
     */
    getEvents() {
        return this.filter(method => method.type === 'event').map(event => event.name);
    },
    /**
     * Gets a transaction result `input` and returns a parsed object with the method execution details.
     * For this to work, `abiDecoder.addABI` needs to be called beforehand, which is done by the constructor
     * @param  {string} input - Hex input
     * @return {object} - Object representing the method execution
     */
    decodeMethod(input) {
        return abi_decoder_1.abiDecoder.decodeMethod(input);
    },
    /**
     * Gets a transaction receipt `logs` and returns a parsed array with the details
     * For this to work, `abiDecoder.addABI` needs to be called beforehand, which is done by the constructor
     * @param  {string} logs - Hex logs
     * @return {array<object>} - An array of logs triggered by the transaction
     */
    decodeLogs(logs) {
        return abi_decoder_1.abiDecoder.decodeLogs(logs);
    },
    /**
     * Tries to find the supplied parameter to a *decoded* method {@link abi#decodeMethod}. It returns the Wei value
     * A method typicaly consist of { "name": "methodName", "params": [{ "name": "paramName", "value": "VALUE_IN_WEI", "type": "uint256" }] }
     * @param  {object} decodedMethod
     * @param  {string} paramName
     * @return {string} - Found result or undefined
     */
    findParamValue(decodedMethod, paramName) {
        const params = decodedMethod.params || [];
        const param = params.find(param => param.name === paramName);
        if (param) {
            return param.value;
        }
    },
    /**
     * Sanitize ABI.
     * Web3 0.X.X has "owner" as a reserved word, so if one of the event parameters name is "owner"
     * it will break. This method will change every "owner" to "_owner"
     * @param  {array} ABI
     * @return {array} - Sanitized ABI
     */
    sanitize(abi) {
        return abi.map(prop => {
            let inputs = prop.inputs;
            if (prop.name && prop.type === 'event') {
                inputs = prop.inputs.map(input => {
                    if (input.name === 'owner') {
                        input.name = '_owner';
                    }
                    return input;
                });
            }
            return Object.assign({}, prop, { inputs });
        });
    }
};
exports.Abi = Object.assign({ 
    // menduz: shady, super shady
    new(abiObject) {
        const newAbi = Object.create(abiObject);
        abi_decoder_1.abiDecoder.addABI(abiObject);
        return Object.assign(newAbi, abi);
    } }, abi);
//# sourceMappingURL=Abi.js.map