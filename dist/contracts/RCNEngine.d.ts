import { Contract } from '../ethereum';
/** RCNEngine contract class */
export declare class RCNEngine extends Contract {
    constructor(address: string);
    getContractName(): string;
}
