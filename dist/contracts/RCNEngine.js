"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethereum_1 = require("../ethereum");
const { abi } = require('./artifacts/RCNEngine.json');
/** RCNEngine contract class */
class RCNEngine extends ethereum_1.Contract {
    constructor(address) {
        super(address, abi);
    }
    getContractName() {
        return 'RCNEngine';
    }
}
exports.RCNEngine = RCNEngine;
//# sourceMappingURL=RCNEngine.js.map