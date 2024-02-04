export = ConfigService;
declare class ConfigService {
    /**
     *
     * @param {Object} payload
     * @param {String} [payload.filename]
     * @param {String} [payload.path]
     */
    constructor({ filename, path }: {
        filename?: string;
        path?: string;
    });
    /**
     * @type {String}
     */
    filename: string;
    /**
     * @description all path
     * @type {Object}
     */
    path: any;
    /**
     * @description logger
     * @type {Object}
     */
    logger: any;
    /**
     * @description configure the service
     * @param {Object} payload
     * @param {String} [payload.filename]
     * @param {String} [payload.path]
     * @param {Object} [payload.logger]
     * @returns {ConfigService} self
     */
    configure({ filename, path, logger }: {
        filename?: string;
        path?: string;
        logger?: any;
    }): ConfigService;
    /**
     * @description check the user session
     * @param {Object} payload
     * @param {String} [payload.schema]
     * @param {String} [payload.filename]
     * @param {String} [payload.file]
     * @param {String} [payload.path]
     * @param {String} [payload.type]
     * @param {Object} [target]
     * @returns {Promise<any>} config
     */
    load({ schema, file, filename, path, type }: {
        schema?: string;
        filename?: string;
        file?: string;
        path?: string;
        type?: string;
    }, target?: any): Promise<any>;
}
