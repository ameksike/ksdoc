const _path = require('path');
const utl = require('../utl');
const _fs = require('fs');
const _fsp = _fs.promises;
class ConfigService {
    /**
     * @type {String}
     */
    filename;

    /**
     * @description all path 
     * @type {Object}
     */
    path;

    constructor({ filename, path }) {
        this.filename = filename || "config";
        this.path = path || {};
    }

    configure({ filename, path }) {
        this.filename = filename || this.filename;
        this.path = path || this.path;
    }

    /**
     * @description check the user session
     * @param {Object} payload 
     * @param {String} payload.scheme 
     * @param {String} payload.filename 
     * @param {Object} target
     * @returns {Promise<any>} config
     */
    async load({ scheme, filename, type }, target) {
        try {
            let file = _path.join(utl.mix(this.path.core, { ...this.path, scheme }), filename || this.filename);
            let data = await this.readFile(file + (type || ".json"), type || "json");
            data = data || await this.readFile(file);
            if (target) {
                // main options
                data?.cfg && (target.cfg = { ...target.cfg, ...data.cfg });
                data?.path && (target.path = { ...target.path, ...data.path });
                data?.route && (target.route = { ...target.route, ...data.route });
                data?.template && (target.template = { ...target.template, ...data.template });
                // main services
                data?.languageService && (target.languageService = data.languageService);
                data?.dataService && (target.dataService = data.dataService);
                data?.menuService && (target.menuService = data.menuService);
                data?.tplService && (target.tplService = data.tplService);
                data?.logger && (target.logger = data.logger);
                data?.sessionService && (target.sessionService = data.sessionService);
                data?.authService && (target.authService = data.authService);
                data?.apiController && (target.apiController = data.apiController);
            }
            return data;
        }
        catch (_) {
            return {};
        }
    }

    /**
     * @description read objects from file 
     * @param {String} file 
     * @param {String} type 
     * @returns {Promise<Object>}
     */
    async readFile(file, type = "", encoding = "utf8") {
        try {
            let content = type === "json" ? await _fsp.readFile(file, encoding) : require(file);
            return typeof content === "string" ? JSON.parse(content) : content;
        }
        catch (_) {
            return null;
        }
    }
}

module.exports = ConfigService;