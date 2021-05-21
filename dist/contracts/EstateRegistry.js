"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethereum_1 = require("../ethereum");
const { abi } = require('./artifacts/EstateRegistry.json');
class EstateRegistry extends ethereum_1.Contract {
    constructor(address) {
        super(address, abi);
    }
    getContractName() {
        return 'EstateRegistry';
    }
}
exports.EstateRegistry = EstateRegistry;
//# sourceMappingURL=EstateRegistry.js.map