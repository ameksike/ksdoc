const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const ksdp = require('ksdp');
const path = require('path');
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

    constructor() {
        super();
        this.serve = swaggerUi.serve;
        this.cfg = null;
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
     * @returns {Array} midllewares
     */
    init(cfg = null) {
        const metadata = this.content?.getDataSync({ name: this.keys.description }) || {};

        cfg = cfg || this.cfg;
        cfg.swaggerDefinition.tags = this.loadTags(cfg?.topics, metadata);
        cfg.swaggerDefinition.info.version = metadata.version || cfg.swaggerDefinition.info.version;
        cfg.swaggerDefinition.info.description = this.loadDescription(metadata) || cfg.swaggerDefinition.info.description;
        Array.isArray(cfg.apis) && (cfg.apis = cfg.apis.map(item => utl.interpolate(item, { api: this.path.root })));

        const swaggerSpec = swaggerJSDoc(cfg);
        const delegate = swaggerUi.setup(swaggerSpec, {
            explorer: false,
            customCssUrl: cfg.css,
            customJs: cfg.js
        });

        return [this.serve, delegate];
    }

    loadTags(topics, metadata) {
        return [];
    }

    loadDescription(metadata = {}) {
        return this.template?.description ? this.tplHandler?.compile(
            path.join(this.template?.description),
            metadata
        ) : "";
    }
}

module.exports = SwaggerController;