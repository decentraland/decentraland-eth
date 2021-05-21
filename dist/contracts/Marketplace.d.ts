import { Contract } from '../ethereum';
/** Marketplace contract class */
export declare class Marketplace extends Contract {
    constructor(address: string);
    getContractName(): string;
}
