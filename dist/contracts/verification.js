"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This class decorator adds the missing methods to the prototype of a class
 * @param contract abi of the contract
 */
function fulfillContractMethods(instance, abi) {
    for (const method of abi) {
        const { name, stateMutability, type } = method;
        if (!(name in instance)) {
            switch (type) {
                case 'function': {
                    if (stateMutability === 'view' || stateMutability === 'pure') {
                        instance[name] = new Function(`return this.sendCall('${name}', ...arguments)`);
                    }
                    else if (stateMutability === 'nonpayable') {
                        instance[name] = new Function(`return this.sendTransaction('${name}', ...arguments)`);
                    }
                    break;
                }
            }
        }
    }
}
exports.fulfillContractMethods = fulfillContractMethods;
//# sourceMappingURL=verification.js.map