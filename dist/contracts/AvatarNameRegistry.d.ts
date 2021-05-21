import { Contract } from '../ethereum';
export declare class AvatarNameRegistry extends Contract {
    constructor(address: string);
    getContractName(): string;
}
