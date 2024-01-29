
module.exports = {

    /**
     * @description string interpolation 
     * @param {String} str 
     * @param {Object} option 
     * @param {String} open 
     * @param {String} close 
     * @returns {String} string
     */
    interpolate(str, option, open = "{", close = "}") {
        if (!str) {
            return "";
        }
        if (!option) {
            return str;
        }
        for (let i in option) {
            str = str.replace(new RegExp(open + i + close, "g"), option[i]);
        }
        return str;
    }

};