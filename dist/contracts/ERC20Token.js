"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethereum_1 = require("../ethereum");
const verification_1 = require("./verification");
const { abi } = require('./artifacts/ERC20Token.json');
/** ERC20Token contract class */
class ERC20Token extends ethereum_1.Contract {
    constructor(address) {
        super(address, abi);
        verification_1.fulfillContractMethods(this, abi);
    }
    getContractName() {
        return 'ERC20Token';
    }
}
exports.ERC20Token = ERC20Token;
//# sourceMappingURL=ERC20Token.js.map