const _path = require('path');
const utl = require('../utl');
const _fs = require('fs');
const _fsp = _fs.promises;

class MenuService {
    /**
     * @description all path 
     * @type {Object}
     */
    path;

    /**
     * @description all path 
     * @type {Object}
     */
    route;

    /**
     * @description all path 
     * @type {Object}
     */
    cfg;

    constructor({ path, route, cfg }) {
        this.route = cfg || {};
        this.route = route || {};
        this.path = path || {};
    }

    configure({ path, route, cfg }) {
        this.route = cfg || this.cfg;
        this.route = route || this.route;
        this.path = path || this.path;
    }

    /**
     * @description check the user session
     * @param {Object} payload 
     * @param {String} [payload.scheme] 
     * @param {Object} [payload.path] 
     * @param {Object} [payload.route] 
     * @param {Object} [payload.cfg] 
     * @param {Object|String} [payload.source]
     * @returns {Promise<any>} config
     */
    async load({ scheme, path, route, cfg, source }) {
        try {
            path = path || this.path;
            route = route || this.route;
            cfg = cfg || this.cfg;
            source = source || cfg?.menu || path.page;
            if (typeof source === "string") {
                source = _path.resolve(utl.mix(source, { ...path, scheme }));
            }
            return this.loadDir(source, item => {
                let title = item.name.replace(/\.html$/i, "");
                let url = utl.mix(item.url || this.route.pag, { ...this.route, scheme, page: title });
                return { url, title };
            });
        }
        catch (_) {
            return {};
        }
    }

    /**
     * @description get the list of topics to the menu
     * @param {Array<Object>|String} source 
     * @param {Function|null} [render] 
     * @returns {Promise<any>}
     */
    async loadDir(source, render = null) {
        let dir, files, result;
        try {
            dir = Array.isArray(source) ? source : await _fsp.readdir(source, { withFileTypes: true });
            files = dir.filter(item => (item.isDirectory && !item.isDirectory()) || !item.isDirectory);
            result = render instanceof Function ? files.map((item, i) => render(item, i, source)) : files;
        }
        catch (error) {
            result = [];
            this.logger?.error({
                src: "KsDocs:Content:loadDir",
                error
            });
        }
        return result;
    }
}

module.exports = MenuService;