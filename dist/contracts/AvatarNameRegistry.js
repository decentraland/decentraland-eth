"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethereum_1 = require("../ethereum");
const { abi } = require('./artifacts/AvatarNameRegistry.json');
class AvatarNameRegistry extends ethereum_1.Contract {
    constructor(address) {
        super(address, abi);
    }
    getContractName() {
        return 'AvatarNameRegistry';
    }
}
exports.AvatarNameRegistry = AvatarNameRegistry;
//# sourceMappingURL=AvatarNameRegistry.js.map