"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Event class */
class Event {
    constructor(contract, name) {
        this.contract = contract;
        this.name = name;
        if (!this.instance) {
            throw new Error(`Could not find event "${name}" for ${contract.getContractName()} contract`);
        }
    }
    get instance() {
        return this.contract.instance[this.name];
    }
    watch(options, callback) {
        const { args, opts } = typeof options === 'function' ? {} : options;
        const func = typeof options === 'function' ? options : callback;
        this.instance(args, opts).watch(func);
    }
    getAll(options, callback) {
        const { args, opts } = typeof options === 'function' ? {} : options;
        const func = typeof options === 'function' ? options : callback;
        this.instance(args, opts).get(func);
    }
    watchByType(options, callback) {
        const opts = typeof options === 'function' ? {} : options;
        const func = typeof options === 'function' ? options : callback;
        for (let event in this.instance) {
            this.instance[event](opts).watch(func);
        }
    }
    getAllByType(options, callback) {
        const opts = typeof options === 'function' ? {} : options;
        const func = typeof options === 'function' ? options : callback;
        for (let event in this.instance) {
            this.instance[event](opts).get(func);
        }
    }
}
exports.Event = Event;
//# sourceMappingURL=Event.js.map