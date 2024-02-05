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
     * @param {Object} [option.paths]
     * @param {String} [option.idiom]
     * @param {String} [option.schema]
     * @param {String} [option.extension]
     * @param {String} [option.filename]
     * @returns {Promise<Object>}
     */
    load(option) {
        let { path, idiom = "en", extension, schema, filename, paths } = option || {};
        path = path || utl.mix(paths?.lang, { ...paths, schema });
        filename = filename || (idiom || this.default) + "." + (extension || this.extension);
        let file = schema === "ksdoc" ? _path.join(__dirname, "../../doc/lang", filename) : _path.join(path, filename);
        return utl.fileRead(file);
    }

    /**
     * @description safe language access
     * @param {String} [key]
     * @param {Object} [source] 
     * @returns {String} value
     */
    at(key = null, source = null) {
        try {
            if (!source || key) {
                return "";
            }
            return source[key];
        }
        catch (_) {
            return "";
        }
    }
}

module.exports = Language;