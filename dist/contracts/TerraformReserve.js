"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethereum_1 = require("../ethereum");
const verification_1 = require("./verification");
const { abi } = require('./artifacts/TerraformReserve.json');
/** TerraformReserve contract class */
class TerraformReserve extends ethereum_1.Contract {
    constructor(address) {
        super(address, abi);
        verification_1.fulfillContractMethods(this, abi);
    }
    getContractName() {
        return 'TerraformReserve';
    }
    lockMana(sender, mana) {
        return this.lockManaWei(sender, ethereum_1.eth.utils.toWei(mana));
    }
    lockManaWei(sender, mana, opts = { gas: 1200 }) {
        // TODO: unlock account here?
        return this.sendTransaction('lockMana', sender, mana, opts);
    }
}
exports.TerraformReserve = TerraformReserve;
//# sourceMappingURL=TerraformReserve.js.map