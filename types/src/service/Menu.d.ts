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
    configure({ path, route, cfg }: {
        path: any;
        route: any;
        cfg: any;
    }): void;
    /**
     * @description check the user session
     * @param {Object} payload
     * @param {String} [payload.scheme]
     * @param {Object} [payload.path]
     * @param {Object} [payload.route]
     * @param {Object} [payload.cfg]
     * @param {Object|String} [payload.source]
     * @returns {Promise<any>} config
     */
    load({ scheme, path, route, cfg, source }: {
        scheme?: string;
        path?: any;
        route?: any;
        cfg?: any;
        source?: any | string;
    }): Promise<any>;
    /**
     * @description get the list of topics to the menu
     * @param {Array<Object>|String} source
     * @param {Function|null} [render]
     * @returns {Promise<any>}
     */
    loadDir(source: Array<any> | string, render?: Function | null): Promise<any>;
}
