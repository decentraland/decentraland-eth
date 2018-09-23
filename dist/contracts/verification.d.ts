import { Contract } from '..';
/**
 * This class decorator adds the missing methods to the prototype of a class
 * @param contract abi of the contract
 */
export declare function fulfillContractMethods(instance: Contract, abi: any[]): void;
