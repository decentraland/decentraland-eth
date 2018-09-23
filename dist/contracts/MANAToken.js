"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethereum_1 = require("../ethereum");
const verification_1 = require("./verification");
const { abi } = require('./artifacts/MANAToken.json');
/** MANAToken contract class */
class MANAToken extends ethereum_1.Contract {
    constructor(address) {
        super(address, abi);
        verification_1.fulfillContractMethods(this, abi);
    }
    getContractName() {
        return 'MANAToken';
    }
    async approve(spender, mana) {
        return this.sendTransaction('approve', spender, ethereum_1.eth.utils.toWei(mana));
    }
    async allowance(owner, spender) {
        const assigned = await this.sendCall('allowance', owner, spender);
        return ethereum_1.eth.utils.fromWei(assigned);
    }
    async balanceOf(owner) {
        const manaBalance = await this.sendCall('balanceOf', owner);
        return ethereum_1.eth.utils.fromWei(manaBalance);
    }
}
exports.MANAToken = MANAToken;
//# sourceMappingURL=MANAToken.js.map