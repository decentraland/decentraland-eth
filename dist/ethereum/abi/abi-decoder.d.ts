declare function _getABIs(): any[];
declare function _addABI(abiArray: any): void;
declare function _removeABI(abiArray: any): void;
declare function _getMethodIDs(): {};
declare function _decodeMethod(data: any): {
    name: any;
    params: any;
};
declare function _decodeLogs(logs: any): any;
export declare const abiDecoder: {
    getABIs: typeof _getABIs;
    addABI: typeof _addABI;
    getMethodIDs: typeof _getMethodIDs;
    decodeMethod: typeof _decodeMethod;
    decodeLogs: typeof _decodeLogs;
    removeABI: typeof _removeABI;
};
export {};
