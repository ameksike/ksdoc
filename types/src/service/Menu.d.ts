export = MenuService;
declare class MenuService {
    constructor({ path, route, cfg }: {
        path: any;
        route: any;
        cfg: any;
    });
    /**
     * @description all path
     * @type {Object}
     */
    path: any;
    /**
     * @description all path
     * @type {Object}
     */
    route: any;
    /**
     * @description all path
     * @type {Object}
     */
    cfg: any;
    /**
     * @description logger
     * @type {Object|null}
     */
    logger: any | null;
    configure({ path, route, cfg, logger }: {
        path: any;
        route: any;
        cfg: any;
        logger: any;
    }): void;
    /**
     * @description check the user session
     * @param {Object} payload
     * @param {String} [payload.schema]
     * @param {Object} [payload.path]
     * @param {Object} [payload.route]
     * @param {Object} [payload.cfg]
     * @param {Function} [payload.action]
     * @param {Object|String} [payload.source]
     * @returns {Promise<any>} config
     */
    load({ schema, path, route, cfg, source, action }: {
        schema?: string;
        path?: any;
        route?: any;
        cfg?: any;
        action?: Function;
        source?: any | string;
    }): Promise<any>;
    /**
     * @description get the list of topics to the menu
     * @param {Array<Object>|String} source
     * @param {Object} option
     * @param {Function|null} [option.render]
     * @param {Function|null} [option.filter]
     * @param {Boolean|null} [option.onlyDir]
     * @returns {Promise<Array<any>>}
     */
    loadDir(source: Array<any> | string, { render, onlyDir, filter }: {
        render?: Function | null;
        filter?: Function | null;
        onlyDir?: boolean | null;
    }): Promise<Array<any>>;
}
