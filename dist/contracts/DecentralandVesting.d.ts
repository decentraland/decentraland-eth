import { Contract } from '../ethereum';
/** DecentralandVesting contract class */
export declare class DecentralandVesting extends Contract {
    constructor(address?: string);
    getContractName(): string;
    duration(): Promise<number>;
    cliff(): Promise<number>;
    vestedAmount(): Promise<number>;
    releasableAmount(): Promise<number>;
    released(): Promise<number>;
    start(): Promise<number>;
}
