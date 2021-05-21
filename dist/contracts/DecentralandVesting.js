"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethereum_1 = require("../ethereum");
const { abi } = require('./artifacts/DecentralandVesting.json');
/** DecentralandVesting contract class */
class DecentralandVesting extends ethereum_1.Contract {
    constructor(address = process.env.TERRAFORM_RESERVE_CONTRACT_ADDRESS) {
        super(address, abi);
    }
    getContractName() {
        return 'DecentralandVesting';
    }
    async duration() {
        const bigNumber = await this.sendCall('duration');
        return bigNumber.toNumber();
    }
    async cliff() {
        const bigNumber = await this.sendCall('cliff');
        return bigNumber.toNumber();
    }
    async vestedAmount() {
        const bigNumber = await this.sendCall('vestedAmount');
        return ethereum_1.eth.utils.fromWei(bigNumber.toNumber());
    }
    async releasableAmount() {
        const bigNumber = await this.sendCall('releasableAmount');
        return ethereum_1.eth.utils.fromWei(bigNumber.toNumber());
    }
    async released() {
        const bigNumber = await this.sendCall('released');
        return ethereum_1.eth.utils.fromWei(bigNumber.toNumber());
    }
    async start() {
        const bigNumber = await this.sendCall('start');
        return bigNumber.toNumber();
    }
}
exports.DecentralandVesting = DecentralandVesting;
//# sourceMappingURL=DecentralandVesting.js.map