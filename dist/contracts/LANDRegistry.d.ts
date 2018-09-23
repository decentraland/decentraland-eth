import { Contract } from '../ethereum';
export declare class DataError extends Error {
    constructor(message: any);
}
/** LANDToken contract class */
export declare class LANDRegistry extends Contract {
    static DataError: typeof DataError;
    constructor(address: string);
    static decodeLandData(data?: string): {
        version: any;
        name: any;
        description: any;
        ipns: any;
    };
    static encodeLandData(data?: any): any;
    getContractName(): string;
    updateManyLandData(coordinates: {
        x: number;
        y: number;
    }[], data: string): Promise<any>;
}
