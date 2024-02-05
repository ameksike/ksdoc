export = Language;
declare class Language {
    /**
     * @type {String}
     */
    default: string;
    /**
     * @type {String}
     */
    extension: string;
    /**
     * @description load language content
     * @param {Object} [option]
     * @param {String} [option.path]
     * @param {Object} [option.paths]
     * @param {String} [option.idiom]
     * @param {String} [option.schema]
     * @param {String} [option.extension]
     * @param {String} [option.filename]
     * @returns {Promise<Object>}
     */
    load(option?: {
        path?: string;
        paths?: any;
        idiom?: string;
        schema?: string;
        extension?: string;
        filename?: string;
    }): Promise<any>;
    /**
     * @description safe language access
     * @param {String} [key]
     * @param {Object} [source]
     * @returns {String} value
     */
    at(key?: string, source?: any): string;
}
