const _path = require("path");
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
        try {
            const file = _path.join(path, (idiom || this.default) + "." + (extension || this.extension));
            return Promise.resolve(file ? require(file) : {});
        }
        catch (_) {
            return Promise.resolve({});
        }
    }
}

module.exports = Language;