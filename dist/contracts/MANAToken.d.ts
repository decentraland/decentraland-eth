import { Contract } from '../ethereum';
export interface MANAToken {
    mintingFinished(): Promise<boolean>;
    name(): Promise<string>;
    totalSupply(): Promise<any>;
    transferFrom(from: string, to: string, value: any): Promise<boolean>;
    decimals(): Promise<number>;
    unpause(): Promise<boolean>;
    mint(to: string, amount: any): Promise<string>;
    burn(value: any): Promise<void>;
    paused(): Promise<boolean>;
    finishMinting(): Promise<boolean>;
    pause(): Promise<boolean>;
    owner(): Promise<string>;
    symbol(): Promise<string>;
    transferOwnership(newOwner: string): Promise<void>;
    transfer(to: string, value: any): Promise<boolean>;
}
/** MANAToken contract class */
export declare class MANAToken extends Contract {
    constructor(address: string);
    getContractName(): string;
    approve(spender: string, mana: number): Promise<any>;
    allowance(owner: string, spender: string): Promise<number>;
    balanceOf(owner: string): Promise<number>;
}
