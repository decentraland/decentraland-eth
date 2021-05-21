"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethereum_1 = require("../ethereum");
const { abi } = require('./artifacts/DecentralandInvite.json');
/** DecentralandInvite contract class */
class DecentralandInvite extends ethereum_1.Contract {
    constructor(address) {
        super(address, abi);
    }
    getContractName() {
        return 'DecentralandInvite';
    }
}
exports.DecentralandInvite = DecentralandInvite;
//# sourceMappingURL=DecentralandInvite.js.map