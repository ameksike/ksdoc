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
     * @param {Object} [option]
     * @param {String} [option.path]
     * @returns {Promise<Object>}
     */
    load({ path, idiom = "en", extension }) {
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