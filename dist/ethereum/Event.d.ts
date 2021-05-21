import { Contract } from '.';
export declare type WatchOptions = {
    /** Indexed return values you want to filter the logs by */
    args?: any;
    /** Additional filter options, fordwarded to {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethfilter} */
    opts?: any;
};
/** Event class */
export declare class Event {
    contract: Contract;
    name: string;
    constructor(contract: Contract, name: string);
    readonly instance: any;
    /**
     * Register a callback for each time this event appears for the contract
     * @param  {object|function} [options] - If options is a function it'll be used as callback, ignoring the second argument
     * @param  {object} [options.args] - Indexed return values you want to filter the logs by
     * @param  {object} [options.opts] - Additional filter options, fordwarded to {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethfilter}
     * @param  {number|string} [options.fromBlock='latest'] - The number of the earliest block. latest means the most recent and pending currently mining, block
     * @param  {number|string} [options.toBlock='latest'] - The number of the latest block latest means the most recent and pending currently mining, block
     * @param  {string} [options.address] - An address or a list of addresses to only get logs from particular account(s).
     * @param  {Array<strings>} [options.topics] - An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use null.
     * @param  {Function} callback     - Callback function for each event found
     */
    watch(callback: Function): any;
    watch(options: WatchOptions, callback?: Function): any;
    /**
     * Get all the historical events
     * @param  {object|function} [options] - If options is a function it'll be used as callback, ignoring the second argument
     * @param  {object} [options.args] - Indexed return values you want to filter the logs by
     * @param  {object} [options.opts] - Additional filter options, fordwarded to {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethfilter}
     * @param  {number|string} [options.fromBlock='latest'] - The number of the earliest block. latest means the most recent and pending currently mining, block
     * @param  {number|string} [options.toBlock='latest'] - The number of the latest block latest means the most recent and pending currently mining, block
     * @param  {string} [options.address] - An address or a list of addresses to only get logs from particular account(s).
     * @param  {Array<strings>} [options.topics] - An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use null.
     * @param  {Function} callback     - Callback function for each event found
     */
    getAll(callback?: Function): any;
    getAll(options: WatchOptions, callback?: Function): any;
    /**
     * Register a callback for each time this event type appears for the contract
     * @param  {object|function} [options] - If options is a function it'll be used as callback, ignoring the second argument
     * @param  {object} [options.opts] - Additional filter options, fordwarded to {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethfilter}
     * @param  {number|string} [options.fromBlock='latest'] - The number of the earliest block. latest means the most recent and pending currently mining, block
     * @param  {number|string} [options.toBlock='latest'] - The number of the latest block latest means the most recent and pending currently mining, block
     * @param  {string} [options.address] - An address or a list of addresses to only get logs from particular account(s).
     * @param  {Array<strings>} [options.topics] - An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use null.
     * @param  {Function} callback     - Callback function for each event found
     */
    watchByType(callback: Function): any;
    watchByType(options: WatchOptions, callback?: Function): any;
    /**
     * Get all the historical events by type
     * @param  {object|function} [options] - If options is a function it'll be used as callback, ignoring the second argument
     * @param  {object} [options.opts] - Additional filter options, fordwarded to {@link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethfilter}
     * @param  {number|string} [options.fromBlock='latest'] - The number of the earliest block. latest means the most recent and pending currently mining, block
     * @param  {number|string} [options.toBlock='latest'] - The number of the latest block latest means the most recent and pending currently mining, block
     * @param  {string} [options.address] - An address or a list of addresses to only get logs from particular account(s).
     * @param  {Array<strings>} [options.topics] - An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use null.
     * @param  {Function} callback     - Callback function for each event found
     */
    getAllByType(callback?: Function): any;
    getAllByType(options: WatchOptions, callback?: Function): any;
}
