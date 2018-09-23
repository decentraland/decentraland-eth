"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Promisifies a node callback style function. Takes a second argument that is bound as `this`
 * @param  {Function} fn - Node style callback, accepting (error, result)
 * @return {Promise}
 */
function promisify(fn) {
    return (...args) => new Promise((resolve, reject) => {
        fn(...args, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
}
exports.promisify = promisify;
/**
 * Sleep for a certain amount of milliseconds
 * @param {integer} ms - miliseconds to sleep
 * @return {Promise} - Promise that resolves when the sleeping is done
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.sleep = sleep;
//# sourceMappingURL=index.js.map