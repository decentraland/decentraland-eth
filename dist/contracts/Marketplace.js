"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethereum_1 = require("../ethereum");
const { abi } = require('./artifacts/Marketplace.json');
/** Marketplace contract class */
class Marketplace extends ethereum_1.Contract {
    constructor(address) {
        super(address, abi);
    }
    getContractName() {
        return 'Marketplace';
    }
}
exports.Marketplace = Marketplace;
//# sourceMappingURL=Marketplace.js.map