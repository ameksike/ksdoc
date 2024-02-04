const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const _path = require('path');
const ksdp = require('ksdp');
const utl = require('../utl');

class SwaggerController extends ksdp.integration.Dip {

    /**
     * @type {Console|null}
     */
    logger = null;

    /**
     * @type {Object|null}
     */
    cfg = null;

    /**
     * @type {Object|null}
     */
    content = null;

    /**
     * @description Template engine
     * @type {Object}
     */
    tplService;

    /**
     * @description all path 
     * @type {Object}
     */
    path;

    /**
     * @description Content Service
     * @type {Object|null}
     */
    contentService;

    /**
     * @description Data Service
     * @type {Object|null}
     */
    dataService;

    constructor() {
        super();
        this.serve = swaggerUi.serve;
        this.cfg = null;
        this.path = {};
    }

    /**
     * @description configure the SwaggerController module 
     * @param {Object} option 
     * @returns {SwaggerController} self
     */
    configure(option) {
        return typeof option === "object" ? this.inject(option) : this;
    }

    /**
     * @description initialize the swagger 
     * @param {Object} [cfg] 
     * @param {Object} [option] 
     * @param {String} [option.path] 
     * @param {String} [option.schema]
     * @param {String} [option.flow] 
     * @param {Object} [option]
     * @returns {Promise<any[]>} midllewares
     */
    async init(cfg = null, option = null, scope = null) {
        const config = await this.loadConfig(option);
        if (!config) {
            null;
        }
        const cfgApi = { ...cfg, ...config };
        const metadata = await this.dataService?.load({ ...cfgApi, ...option, name: "desc" }) || {};
        cfgApi.swaggerDefinition.tags = this.loadTags(metadata, cfgApi);
        cfgApi.swaggerDefinition.info.version = metadata?.version || cfgApi?.swaggerDefinition?.info?.version;
        cfgApi.swaggerDefinition.info.description = await this.loadDescription({
            ...option,
            pageid: "desc",
            dataSrv: {
                version: cfgApi?.swaggerDefinition?.info?.version || scope?.metadata?.version,
                description: cfgApi?.swaggerDefinition?.info?.description || scope?.metadata?.description,
                ...metadata
            }
        });
        const swaggerSpec = swaggerJSDoc(cfgApi);
        const delegate = swaggerUi.setup(swaggerSpec, {
            explorer: false,
            customCssUrl: cfgApi.css,
            customJs: cfgApi.js
        });
        return delegate;
    }

    /**
     * @description get the topic or tag list 
     * @param {Object} [metadata] 
     * @param {Object} [cfg] 
     * @returns {Array<any>}
     */
    loadTags(metadata, cfg = null) {
        return metadata?.tags || metadata?.swaggerDefinition?.tags || cfg?.swaggerDefinition?.tags || [];
    }

    /**
     * @description load description
     * @param {Object} [metadata] 
     * @param {Object} [cfg] 
     * @returns {Promise<string>} description
     */
    async loadDescription(metadata = {}, cfg = null) {
        const des = await this.contentService?.select(metadata);
        return des ? des.replace(/[\r\n]/gi, " ") : metadata?.dataSrv?.description;
    }

    /**
     * @description load config 
     * @param {Object} payload 
     * @param {String} [payload.flow]
     * @param {String} [payload.path]
     * @param {String} [payload.file]
     * @param {String} [payload.filename]
     * @param {String} [payload.schema]
     * @returns {Promise<any>} config
     */
    async loadConfig({ path, flow, file, filename = "config.json", schema }) {
        try {
            file = file || (schema === "ksdoc"
                ? _path.join(__dirname, "../../doc/api", filename)
                : _path.join(path, filename));
            path = schema === "ksdoc" ? _path.dirname(file) : path;
            const config = await utl.fileRead(file);
            Array.isArray(config?.apis) && (config.apis = config.apis.map(item => _path.resolve(utl.mix(item, { root: path }))));
            return config;
        }
        catch (_) {
            this.logger?.error({ flow, src: "KsDoc:API:config:load", error: { message: _?.message } });
            return null;
        }
    }

    middlewares() {
        return swaggerUi.serve;
    }
}

module.exports = SwaggerController;