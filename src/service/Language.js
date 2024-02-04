const _path = require("path");
const utl = require('../utl');

class Language {
    /**
     * @type {String}
     */
    default;

    /**
     * @type {String}
     */
    extension;

    constructor() {
        this.default = "en";
        this.extension = "json";
    }

    /**
     * @description load language content
     * @param {Object} [option]
     * @param {String} [option.path]
     * @param {String} [option.idiom]
     * @param {String} [option.extension]
     * @returns {Promise<Object>}
     */
    load(option) {
        const { path, idiom = "en", extension } = option || {};
        const file = _path.join(path, (idiom || this.default) + "." + (extension || this.extension));
        return utl.fileRead(file);
    }
}

module.exports = Language;