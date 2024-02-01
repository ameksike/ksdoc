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
    serve: any;
    /**
     * @description configure the SwaggerController module
     * @param {Object} option
     * @returns {SwaggerController} self
     */
    configure(option: any): SwaggerController;
    /**
     * @param {Object} [cfg]
     * @param {Object} [option]
     * @param {String} [option.path]
     * @param {String} [option.scheme]
     * @returns {Array} midllewares
     */
    init(cfg?: any, option?: {
        path?: string;
        scheme?: string;
    }): any[];
    loadTags(topics: any, metadata: any): any[];
    loadDescription(metadata?: {}): any;
    loadConfig({ path }: {
        path: any;
    }): any;
    middlewares(): any;
}
