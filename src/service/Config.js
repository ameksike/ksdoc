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

    /**
     * @description logger
     * @type {Object}
     */
    logger;


    /**
     * 
     * @param {Object} payload 
     * @param {String} [payload.filename] 
     * @param {String} [payload.path] 
     */
    constructor({ filename, path }) {
        this.filename = filename || "config";
        this.path = path || {};
    }

    /**
     * @description configure the service
     * @param {Object} payload 
     * @param {String} [payload.filename] 
     * @param {String} [payload.path] 
     * @param {Object} [payload.logger] 
     * @returns {ConfigService} self
     */
    configure({ filename, path, logger }) {
        this.filename = filename || this.filename;
        this.path = path || this.path;
        this.logger = logger || this.logger;
        return this;
    }

    /**
     * @description check the user session
     * @param {Object} payload 
     * @param {String} [payload.scheme]
     * @param {String} [payload.filename]
     * @param {String} [payload.file]
     * @param {String} [payload.path]
     * @param {String} [payload.type] 
     * @param {Object} [target]
     * @returns {Promise<any>} config
     */
    async load({ scheme, file, filename, path, type }, target) {
        try {
            let paths = { ...this.path, scheme };
            file = file || _path.join(utl.mix(path || this.path.core, paths), filename || this.filename);
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
     * @param {String} [type]
     * @param {String} [encoding] 
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