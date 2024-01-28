const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const ksdp = require('ksdp');
const path = require('path');
const TCfg = require('ksdocs/src/types');

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
        this.cfg = { ...TCfg };
    }

    /**
     * @description configure the SwaggerController module 
     * @param {Object} option 
     * @returns {SwaggerController} self
     */
    setting(option) {
        return typeof option === "object" ? this.inject(option) : this;
    }

    /**
     * @param {Object} [cfg] 
     * @returns {Array} midllewares
     */
    init(cfg = null) {
        this.cfg = cfg || this.cfg || { ...TCfg };
        this.cfg.swaggerDefinition.tags = this.loadTags(this.cfg?.topics);
        this.cfg.swaggerDefinition.info.version = metadata.version;
        this.cfg.swaggerDefinition.info.description = this.loadDescription();

        const swaggerSpec = swaggerJSDoc(this.cfg);
        const delegate = swaggerUi.setup(swaggerSpec, {
            explorer: false,
            customCssUrl: this.cfg.css,
            customJs: this.cfg.js
        });

        return [this.serve, delegate];
    }

    loadTags(topics) {
        return [];
    }

    loadDescription() {
        const metadata = this.content?.getDataSync({ name: this.keys.description }) || {};
        return this.template?.description ? this.tplHandler?.compile(
            path.join(this.template?.description),
            metadata
        ) : "";
    }
}

module.exports = SwaggerController;