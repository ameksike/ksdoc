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
     * @param {String} [option.idiom]
     * @param {String} [option.schema]
     * @param {String} [option.extension]
     * @returns {Promise<Object>}
     */
    load(option?: {
        path?: string;
        idiom?: string;
        schema?: string;
        extension?: string;
    }): Promise<any>;
}
