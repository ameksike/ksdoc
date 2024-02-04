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
     * @param {String} [option.schema]
     * @param {String} [option.flow]
     * @param {Object} [option]
     * @returns {Promise<any[]>} midllewares
     */
    init(cfg?: any, option?: {
        path?: string;
        schema?: string;
        flow?: string;
    }, scope?: any): Promise<any[]>;
    /**
     * @description get the topic or tag list
     * @param {Object} [metadata]
     * @param {Object} [cfg]
     * @returns {Array<any>}
     */
    loadTags(metadata?: any, cfg?: any): Array<any>;
    /**
     * @description load description
     * @param {Object} [metadata]
     * @param {Object} [cfg]
     * @returns {Promise<string>} description
     */
    loadDescription(metadata?: any, cfg?: any): Promise<string>;
    /**
     * @description load config
     * @param {Object} payload
     * @param {String} [payload.flow]
     * @param {String} [payload.path]
     * @param {String} [payload.file]
     * @param {String} [payload.filename]
     * @returns {Promise<any>} config
     */
    loadConfig({ path, flow, file, filename }: {
        flow?: string;
        path?: string;
        file?: string;
        filename?: string;
    }): Promise<any>;
    middlewares(): any;
}
