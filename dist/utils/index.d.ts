/**
 * Promisifies a node callback style function. Takes a second argument that is bound as `this`
 * @param  {Function} fn - Node style callback, accepting (error, result)
 * @return {Promise}
 */
export declare function promisify<T = any>(fn: any): (...args: any[]) => Promise<T>;
/**
 * Sleep for a certain amount of milliseconds
 * @param {integer} ms - miliseconds to sleep
 * @return {Promise} - Promise that resolves when the sleeping is done
 */
export declare function sleep(ms: any): Promise<{}>;
