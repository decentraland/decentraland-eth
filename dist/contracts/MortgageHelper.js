"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethereum_1 = require("../ethereum");
const { abi } = require('./artifacts/MortgageHelper.json');
/** MortgageCreator contract class */
class MortgageHelper extends ethereum_1.Contract {
    constructor(address) {
        super(address, abi);
    }
    getContractName() {
        return 'MortgageHelper';
    }
}
exports.MortgageHelper = MortgageHelper;
//# sourceMappingURL=MortgageHelper.js.map