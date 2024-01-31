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
     * @param {Object} [cfg] 
     * @param {Object} [option] 
     * @returns {Array} midllewares
     */
    init(cfg = null, option) {
        const metadata = this.content?.getDataSync({ name: this.keys.description }) || {};
        const config = this.loadConfig(option);
        Object.assign(cfg, this.cfg, config);
        cfg.swaggerDefinition.tags = this.loadTags(cfg?.topics, metadata);
        cfg.swaggerDefinition.info.version = metadata.version || cfg.swaggerDefinition.info.version;
        cfg.swaggerDefinition.info.description = this.loadDescription(metadata) || cfg.swaggerDefinition.info.description;
        Array.isArray(cfg.apis) && (cfg.apis = cfg.apis.map(item => utl.mix(item, { api: this.path.root })));
        const swaggerSpec = swaggerJSDoc(cfg);
        const delegate = swaggerUi.setup(swaggerSpec, {
            explorer: false,
            customCssUrl: cfg.css,
            customJs: cfg.js
        });
        return delegate;
    }

    loadTags(topics, metadata) {
        return [];
    }

    loadDescription(metadata = {}) {
        return this.template?.description ? this.tplService?.compile(
            "description",
            metadata
        ) : "";
    }

    loadConfig({ path }) {
        try {
            const config = require(_path.join(path, "config.json"));
            Array.isArray(config?.apis) && (config.apis = config.apis.map(item => _path.resolve(utl.mix(item, { root: path }))));
            return config;
        }
        catch (_) {
            return {};
        }
    }

    middlewares() {
        return swaggerUi.serve;
    }
}

module.exports = SwaggerController;