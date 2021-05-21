"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethereum_1 = require("../ethereum");
const { abi } = require('./artifacts/LegacyMarketplace.json');
/** LegacyMarketplace contract class */
class LegacyMarketplace extends ethereum_1.Contract {
    constructor(address) {
        super(address, abi);
    }
    getContractName() {
        return 'LegacyMarketplace';
    }
}
exports.LegacyMarketplace = LegacyMarketplace;
//# sourceMappingURL=LegacyMarketplace.js.map