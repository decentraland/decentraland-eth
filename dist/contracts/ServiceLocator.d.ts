import { Contract } from '../ethereum';
/** ServiceLocator contract class */
export declare class ServiceLocator extends Contract {
    constructor(address: string);
    getContractName(): string;
}
