
const KsTpl = require("kstpl");
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
    }
};