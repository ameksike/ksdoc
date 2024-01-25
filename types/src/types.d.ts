export type TList<T = any> = {
    [name: string]: T;
};
export type TCls<T> = new (...args: any[]) => T;
/**
 * @template [T=object]
 * @typedef {{[name:String]:T}} TList
 **/
/**
 * @template T
 * @typedef {new (...args: any[]) => T} TCls
 */
/**
 * @description Dynamically create an instance of a class with variable parameters.
 * @template T
 * @param {TCls<T>} cls - The class constructor.
 * @param {any[]} [args] - An array of arguments to be passed to the class constructor.
 * @returns {T} - An instance of the class.
 */
export function build<T>(cls: TCls<T>, args?: any[]): T;
