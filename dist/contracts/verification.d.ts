import { Contract } from '..';
export declare type ABIMethod = any;
/**
 * This class decorator adds the missing methods to the prototype of a class
 * @param contract abi of the contract
 */
export declare function fulfillContractMethods(instance: Contract, abi: ABIMethod[]): void;
