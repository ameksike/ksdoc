export = ContentService;
declare const ContentService_base: typeof import("ksdp/types/src/integration/Dip");
declare class ContentService extends ContentService_base {
    /**
     * @description Content service
     * @type {Object|null}
     */
    contentService: any | null;
    /**
     * @description Session service
     * @type {Object|null}
     */
    sessionService: any | null;
    /**
     * @description Data service
     * @type {Object|null}
     */
    dataService: any | null;
    /**
     * @description Language service
     * @type {Object|null}
     */
    languageService: any | null;
    /**
     * @description logger
     * @type {Object|null}
     */
    logger: any | null;
    /**
     * @description Template engine
     * @type {Object|null}
     */
    tplService: any | null;
    /**
     * @description all configurations
     * @type {Object|null}
     */
    cfg: any | null;
    /**
     * @description all path
     * @type {Object|null}
     */
    path: any | null;
    /**
     * @description all routes
     * @type {Object|null}
     */
    route: any | null;
    /**
     * @description all templates
     * @type {Object|null}
     */
    template: any | null;
    delete(payload: any): Promise<any>;
    save(payload: any): Promise<any>;
    searchTpl({ pageid, path, scheme }: {
        pageid: any;
        path: any;
        scheme: any;
    }): {
        exist: boolean;
        isFragment: boolean;
        name: any;
        path: string;
        ext: string;
    };
    getContent({ pageid, flow, token, page, path, scheme, data }: {
        pageid: any;
        flow: any;
        token: any;
        page: any;
        path: any;
        scheme: any;
        data: any;
    }): Promise<any>;
    select(payload: any): Promise<any>;
    /**
     * @description build layout page
     * @param {Object} payload
     * @returns {Promise<String>}
     */
    renderLayout(payload?: any): Promise<string>;
    /**
     * @description load the main menu
     * @param {Object} payload
     * @returns {Promise<any>}
     */
    loadMenu({ scheme, source }: any): Promise<any>;
    /**
     * @description get the list of topics to the menu
     * @param {Array<String>|String} source
     * @param {Function|null} [render]
     * @returns {Promise<any>}
     */
    loadDir(source: Array<string> | string, render?: Function | null): Promise<any>;
}
