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
export namespace TConfig {
    let menu: any;
    namespace session {
        let key: string;
    }
    namespace schema {
        let _default: string;
        export { _default as default };
    }
    namespace metadata {
        let name: string;
        let description: string;
        let version: string;
        let icon: string;
        let image: string;
        let group: string;
        let date: string;
    }
}
export namespace TConfigAPI {
    namespace swaggerDefinition {
        let openapi: string;
        let tags: any[];
        namespace info {
            let version_1: string;
            export { version_1 as version };
            let description_1: string;
            export { description_1 as description };
        }
        let basePath: string;
        let servers: {
            url: string;
            description: string;
            variables: {
                port: {
                    default: string;
                };
                host: {
                    default: string;
                };
            };
        }[];
    }
    let apis: string[];
    let js: any[];
    let css: any[];
    let topics: any[];
}
