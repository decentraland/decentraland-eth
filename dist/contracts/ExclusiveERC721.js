"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethereum_1 = require("../ethereum");
const { abi } = require('./artifacts/ExclusiveERC721.json');
class ExclusiveERC721 extends ethereum_1.Contract {
    constructor(address) {
        super(address, abi);
    }
    getContractName() {
        return 'ExclusiveERC721';
    }
}
exports.ExclusiveERC721 = ExclusiveERC721;
//# sourceMappingURL=ExclusiveERC721.js.map