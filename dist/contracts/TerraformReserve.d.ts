import { Contract } from '../ethereum';
/** TerraformReserve contract class */
export declare class TerraformReserve extends Contract {
    constructor(address: string);
    getContractName(): string;
    lockMana(sender: any, mana: any): Promise<any>;
    lockManaWei(sender: string, mana: any, opts?: {
        gas: number;
    }): Promise<any>;
}
