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

    /**
     * @description logger
     * @type {Object|null}
     */
    logger;

    constructor({ path, route, cfg }) {
        this.route = cfg || {};
        this.route = route || {};
        this.path = path || {};
    }

    configure({ path, route, cfg, logger }) {
        this.route = cfg || this.cfg;
        this.route = route || this.route;
        this.path = path || this.path;
        this.logger = logger || this.logger;
    }

    /**
     * @description check the user session
     * @param {Object} payload 
     * @param {String} [payload.schema] 
     * @param {Object} [payload.path] 
     * @param {Object} [payload.route] 
     * @param {Object} [payload.cfg] 
     * @param {Function} [payload.action] 
     * @param {Object|String} [payload.source]
     * @returns {Promise<any>} config
     */
    async load({ schema, path, route, cfg, source, action }) {
        try {
            path = path || this.path;
            route = route || this.route;
            cfg = cfg || this.cfg;
            source = source || cfg?.menu || path.page;
            if (typeof source === "string") {
                source = _path.resolve(utl.mix(source, { ...path, schema }));
            }
            return this.loadDir(source, {
                render: action instanceof Function ? action : (item) => {
                    let title = item.name.replace(/\.html$/i, "");
                    let url = utl.mix(item.url || this.route.pag, { ...this.route, schema, page: title });
                    return { url, title };
                }
            });
        }
        catch (_) {
            return {};
        }
    }

    /**
     * @description get the list of topics to the menu
     * @param {Array<Object>|String} source 
     * @param {Object} option 
     * @param {Function|null} [option.render] 
     * @param {Function|null} [option.filter] 
     * @param {Boolean|null} [option.onlyDir] 
     * @returns {Promise<Array<any>>}
     */
    async loadDir(source, { render = null, onlyDir = false, filter }) {
        let dir, files, result;
        try {
            dir = Array.isArray(source) ? source : await _fsp.readdir(source, { withFileTypes: true });
            files = onlyDir === null || onlyDir === undefined ? dir : dir.filter(item => !onlyDir === (item.isDirectory instanceof Function && !item.isDirectory() || !item.isDirectory));
            result = render instanceof Function ? files.map((item, i) => render(item, i, source)) : files;
            result = await Promise.all(result);
            result = filter instanceof Function ? result.filter(item => filter(item)) : result;
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