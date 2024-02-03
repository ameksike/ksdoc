export = SwaggerController;
declare const SwaggerController_base: typeof import("ksdp/types/src/integration/Dip");
declare class SwaggerController extends SwaggerController_base {
    /**
     * @type {Console|null}
     */
    logger: Console | null;
    /**
     * @type {Object|null}
     */
    cfg: any | null;
    /**
     * @type {Object|null}
     */
    content: any | null;
    /**
     * @description Template engine
     * @type {Object}
     */
    tplService: any;
    /**
     * @description all path
     * @type {Object}
     */
    path: any;
    /**
     * @description Content Service
     * @type {Object|null}
     */
    contentService: any | null;
    /**
     * @description Data Service
     * @type {Object|null}
     */
    dataService: any | null;
    serve: any;
    /**
     * @description configure the SwaggerController module
     * @param {Object} option
     * @returns {SwaggerController} self
     */
    configure(option: any): SwaggerController;
    /**
     * @description initialize the swagger
     * @param {Object} [cfg]
     * @param {Object} [option]
     * @param {String} [option.path]
     * @param {String} [option.scheme]
     * @param {String} [option.flow]
     * @returns {Promise<any[]>} midllewares
     */
    init(cfg?: any, option?: {
        path?: string;
        scheme?: string;
        flow?: string;
    }): Promise<any[]>;
    /**
     * @description
     * @param {*} topics
     * @param {*} metadata
     * @returns {Array<any>}
     */
    loadTags(topics: any, metadata: any): Array<any>;
    /**
     * @description load description
     * @param {Object} metadata
     * @returns {Promise<string>} description
     */
    loadDescription(metadata?: any): Promise<string>;
    /**
     * @description load config
     * @param {Object} payload
     * @param {String} [payload.flow]
     * @param {String} [payload.path]
     * @returns {Object} config
     */
    loadConfig({ path, flow }: {
        flow?: string;
        path?: string;
    }): any;
    middlewares(): any;
}
