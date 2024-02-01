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
     * @description configure the service
     * @param {Object} payload
     * @param {String} [payload.filename]
     * @param {String} [payload.path]
     * @returns {ConfigService} self
     */
    configure({ filename, path }: {
        filename?: string;
        path?: string;
    }): ConfigService;
    /**
     * @description check the user session
     * @param {Object} payload
     * @param {String} payload.scheme
     * @param {String} payload.filename
     * @param {String} payload.type
     * @param {Object} target
     * @returns {Promise<any>} config
     */
    load({ scheme, filename, type }: {
        scheme: string;
        filename: string;
        type: string;
    }, target: any): Promise<any>;
    /**
     * @description read objects from file
     * @param {String} file
     * @param {String} [type]
     * @param {String} [encoding]
     * @returns {Promise<Object>}
     */
    readFile(file: string, type?: string, encoding?: string): Promise<any>;
}
