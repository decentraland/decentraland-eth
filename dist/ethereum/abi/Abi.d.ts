export declare const Abi: {
    /**
     * Get the contract events
     * @return {Array<string>} - events
     */
    getEvents(): any;
    /**
     * Gets a transaction result `input` and returns a parsed object with the method execution details.
     * For this to work, `abiDecoder.addABI` needs to be called beforehand, which is done by the constructor
     * @param  {string} input - Hex input
     * @return {object} - Object representing the method execution
     */
    decodeMethod(input: any): {
        name: any;
        params: any;
    };
    /**
     * Gets a transaction receipt `logs` and returns a parsed array with the details
     * For this to work, `abiDecoder.addABI` needs to be called beforehand, which is done by the constructor
     * @param  {string} logs - Hex logs
     * @return {array<object>} - An array of logs triggered by the transaction
     */
    decodeLogs(logs: any): any;
    /**
     * Tries to find the supplied parameter to a *decoded* method {@link abi#decodeMethod}. It returns the Wei value
     * A method typicaly consist of { "name": "methodName", "params": [{ "name": "paramName", "value": "VALUE_IN_WEI", "type": "uint256" }] }
     * @param  {object} decodedMethod
     * @param  {string} paramName
     * @return {string} - Found result or undefined
     */
    findParamValue(decodedMethod: any, paramName: any): any;
    new(abiObject: any): any;
};
