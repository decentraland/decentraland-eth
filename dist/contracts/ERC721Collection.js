"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethereum_1 = require("../ethereum");
const { abi } = require('./artifacts/ERC721Collection.json');
class ERC721Collection extends ethereum_1.Contract {
    constructor(address) {
        super(address, abi);
    }
    getContractName() {
        return 'ERC721Collection';
    }
}
exports.ERC721Collection = ERC721Collection;
//# sourceMappingURL=ERC721Collection.js.map