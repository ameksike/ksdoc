import Document = require("./src/Document");
export let handler: IHook;
export function get(cfg?: {
    mode?: 0 | 1;
    cls?: typeof Document;
    options?: any[];
    key?: string;
}): any;
export function set(cfg?: {
    driver?: {
        [name: string]: any;
    };
    handler?: typeof Document;
    options?: any[];
    key?: string;
    mode?: 0 | 1;
}): {
    /**
     * @typedef {import('./src/types').TList} TList
     * @typedef { 0 | 1 } TEnumMode
     */
    /**
     * @description Get the default Hook controller as the class to be instantiated
     * @returns {IHook}
     */
    handler: IHook;
    /**
     * @description Get an instance of the Hook library
     * @param {Object} [cfg]
     * @param {TEnumMode} [cfg.mode=0] Forces creating a new instance if set to 1; otherwise it behaves as a singleton by default
     * @param {typeof Document} [cfg.cls=Document] Define the Document handler as a class to be instantiated
     * @param {Array} [cfg.options] List of parameters to configure the Hook Handler in the instantiation process
     * @param {String} [cfg.key=instance] A namespace key to save the Hook handler instances
     * @returns {Object} Document
     */
    get: (cfg?: {
        mode?: 0 | 1;
        cls?: typeof Document;
        options?: any[];
        key?: string;
    }) => any;
    /**
     * @description configure the hook library
     * @param {Object} [cfg]
     * @param {TList} [cfg.driver] driver instance list
     * @param {typeof Document} [cfg.handler] default driver to use
     * @param {Array} [cfg.options] List of parameters to configure the Hook Handler in the instantiation process
     * @param {String} [cfg.key=instance] A namespace key to save the Hook handler instances
     * @param {TEnumMode} [cfg.mode=0] Forces creating a new instance if set to 1; otherwise it behaves as a singleton by default
     * @returns {KsDoc} self
     */
    set: (cfg?: {
        driver?: {
            [name: string]: any;
        };
        handler?: typeof Document;
        options?: any[];
        key?: string;
        mode?: 0 | 1;
    }) => any;
    driver: {
        Document: typeof Document;
    };
};
export namespace driver {
    export { Document };
}
