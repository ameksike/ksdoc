const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const ksmf = require('ksmf');
const ksdp = require('ksdp');
const path = require('path');

class SwaggerManager extends ksdp.integration.Dip {

    /**
     * @type {Console|null}
     */
    logger = null;

    /**
     * @type {Object|null}
     */
    session = null;

    /**
     * @type {Object|null}
     */
    content = null;

    constructor() {
        super();
        this.serve = swaggerUi.serve;
        this.cfg = { swaggerDefinition: { tags: [], info: { version: '', description: '' } } };


        this.path = path.join(__dirname, '../../../docs');
        this.route = '/doc';
        this.exts = '.html';

        this.js = [];
        this.css = [];
        this.keys = {};
        this.menu = {};
        this.sessionKey = 'doc';
        this.view = this.route + '/view';
        this.viewAccess = this.view + '/auth/access';
        this.tplHandler = new ksmf.view.Tpl();
    }

    setting(configDoc) {
        this.route = configDoc?.route || this.route;
        this.exts = configDoc?.exts || this.exts;
        this.cfg = configDoc?.swagger || this.cfg;
        this.keys = configDoc?.keys || this.keys;
        this.menu = configDoc?.menu || this.menu;

        this.js = configDoc?.js || this.js;
        this.css = configDoc?.css || this.css;
        return this;
    }

    /**
     * 
     * @param {Object} [app] 
     * @param {Object} [cfg] 
     */
    init(app, cfg) {
        this.cfg = cfg || this.cfg;
        const topics = this.menu.topics || path.join(this.path, this.keys.topics);
        const metadata = this.content.getDataSync({ name: this.keys.description }) || {};

        this.cfg.swaggerDefinition.tags = this.loadTopics(topics);
        this.cfg.swaggerDefinition.info.version = metadata.version;
        this.cfg.swaggerDefinition.info.description = this.tplHandler.compile(
            path.join(this.path, this.keys.description + this.exts),
            metadata
        );

        const swaggerSpec = swaggerJSDoc(this.cfg);
        const delegate = swaggerUi.setup(swaggerSpec, {
            explorer: false,
            customCssUrl: this.css,
            customJs: this.js
        });

        if (app.use) {
            app.use(this.route, this.session?.check(this.viewAccess, this.sessionKey, 'simple'), this.serve, delegate);
        }
    }
}

module.exports = SwaggerManager;