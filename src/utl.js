
const KsTpl = require("kstpl");
const _path = require('path');
const _fs = require('fs');
const _fsp = _fs.promises;

module.exports = {

    /**
     * @description string interpolation 
     * @param {String} str 
     * @param {Object} data 
     * @param {String} open 
     * @param {String} close 
     * @returns {String} string
     */
    mix(str, data, open = "{", close = "}") {
        return KsTpl.compile(str, data, { driver: "str", openDelimiter: open, closeDelimiter: close, deep: true });
    },

    /**
     * @description read objects from file 
     * @param {String} file 
     * @param {String} [type]
     * @param {String} [encoding] 
     * @returns {Promise<Object>}
     */
    async fileRead(file, type = "", encoding = "utf8") {
        try {
            file = _path.resolve(file);
            type = type || this.fileExtension(file);
            let content = !type || type === "js" || type === "ts" ? require(file) : await _fsp.readFile(file, encoding);
            return typeof content === "string" && type === "json" ? JSON.parse(content) : content;
        }
        catch (_) {
            return null;
        }
    },

    /**
     * @description get file extension 
     * @param {String} filename 
     * @returns {String} extension
     */
    fileExtension(filename) {
        const lastDotIndex = filename.lastIndexOf('.');
        return (lastDotIndex !== -1 && lastDotIndex !== 0) ? filename.slice(lastDotIndex + 1).toLowerCase() : '';
    }
};