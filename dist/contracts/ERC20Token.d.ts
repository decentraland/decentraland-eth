import { Contract } from '../ethereum';
/** ERC20Token contract class */
export declare class ERC20Token extends Contract {
    constructor(address: string);
    getContractName(): string;
}
