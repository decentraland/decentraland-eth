"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethereum_1 = require("../ethereum");
const { abi } = require('./artifacts/ERC721Bid.json');
class ERC721Bid extends ethereum_1.Contract {
    constructor(address) {
        super(address, abi);
    }
    getContractName() {
        return 'ERC721Bid';
    }
}
exports.ERC721Bid = ERC721Bid;
//# sourceMappingURL=ERC721Bid.js.map