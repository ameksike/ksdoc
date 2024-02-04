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
     * @param {String} [option.schema]
     * @param {String} [option.extension]
     * @returns {Promise<Object>}
     */
    load(option) {
        const { path, idiom = "en", extension, schema } = option || {};
        const filename = (idiom || this.default) + "." + (extension || this.extension);
        const file = schema === "ksdoc" ? _path.join(__dirname, "../../doc/lang", filename) : _path.join(path, filename);
        return utl.fileRead(file);
    }
}

module.exports = Language;