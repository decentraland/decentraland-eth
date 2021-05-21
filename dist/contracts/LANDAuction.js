"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethereum_1 = require("../ethereum");
const { abi } = require('./artifacts/LANDAuction.json');
class LANDAuction extends ethereum_1.Contract {
    constructor(address) {
        super(address, abi);
    }
    getContractName() {
        return 'LANDAuction';
    }
}
exports.LANDAuction = LANDAuction;
//# sourceMappingURL=LANDAuction.js.map