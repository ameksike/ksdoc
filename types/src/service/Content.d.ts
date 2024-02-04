export = ContentService;
declare const ContentService_base: typeof import("ksdp/types/src/integration/Dip");
declare class ContentService extends ContentService_base {
    /**
     * @description Config service
     * @type {Object|null}
     */
    configService: any | null;
    /**
     * @description Session service
     * @type {Object|null}
     */
    sessionService: any | null;
    /**
     * @description Menu Service
     * @type {Object|null}
     */
    menuService: any | null;
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
    searchTpl({ pageid, path, schema }: {
        pageid: any;
        path: any;
        schema: any;
    }): {
        exist: boolean;
        isFragment: boolean;
        name: any;
        path: string;
        ext: string;
    };
    /**
     * @description get html content
     * @param {Object} [payload]
     * @param {String} [payload.pageid]
     * @param {String} [payload.schema]
     * @param {String} [payload.path]
     * @param {Object} [payload.page]
     * @param {Object} [payload.data]
     * @param {String} [payload.flow]
     * @param {String} [payload.token]
     * @returns {Promise<String>} html
     */
    getContent(payload?: {
        pageid?: string;
        schema?: string;
        path?: string;
        page?: any;
        data?: any;
        flow?: string;
        token?: string;
    }): Promise<string>;
    /**
     * @description get content to render
     * @param {Object} [payload]
     * @param {String} [payload.pageid]
     * @param {String} [payload.schema]
     * @param {String} [payload.flow]
     * @param {String} [payload.idm]
     * @param {String} [payload.token]
     * @param {Object} [payload.account]
     * @param {Object} [payload.query]
     * @param {Object} [payload.dataSrv]
     * @param {Object} [payload.config]
     * @returns {Promise<String>} content
     */
    select(payload?: {
        pageid?: string;
        schema?: string;
        flow?: string;
        idm?: string;
        token?: string;
        account?: any;
        query?: any;
        dataSrv?: any;
        config?: any;
    }): Promise<string>;
    /**
     * @description build layout page
     * @param {Object} payload
     * @returns {Promise<String>}
     */
    renderLayout(payload?: any): Promise<string>;
    /**
     * @description defines the options to use by the TPL engine
     * @param {Object} payload
     * @returns {Object} options
     */
    getBuildOption({ schema, page, force }: any): any;
}
