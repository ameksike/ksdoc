const ksdp = require('ksdp');
const path = require('path');
const kstpl = require('kstpl');

const DocumentController = require('./controller/Document');
const SwaggerController = require('./controller/Swagger');
const ContentService = require('./service/Content');
const SessionService = require('./service/Session');

class DocumentModule extends ksdp.integration.Dip {

    /**
     * @description Document Controller
     * @type {typeof DocumentController}
     */
    controller;

    /**
     * @description Document Controller
     * @type {typeof SwaggerController}
     */
    apiController;

    /**
     * @description Document Controller
     * @type {typeof ContentService}
     */
    contentService;

    /**
     * @description Document Controller
     * @type {typeof SessionService}
     */
    sessionService;

    /**
     * @description logger
     * @type {Object}
     */
    logger;

    /**
     * @description Template engine
     * @type {Object}
     */
    tplService;

    /**
     * @description all configurations 
     * @type {Object}
     */
    cfg;

    /**
     * @description all path 
     * @type {Object}
     */
    path;

    /**
     * @description all routes 
     * @type {Object}
     */
    route;

    /**
     * @description all templates 
     * @type {Object}
     */
    template;

    constructor() {
        super();
        this.controller = new DocumentController();
        this.apiController = new SwaggerController();
        this.contentService = new ContentService();
        this.sessionService = new SessionService();
        this.tplService = kstpl;
        this.tplService.configure({
            ext: "",
            default: "twing",
            path: this.path.page
        });
        this.cfg = {};
        this.path = {
            root: path.join(__dirname, '../../../doc'),
            config: path.join(__dirname, '../../../doc'),
            resource: path.join(__dirname, '../../../doc'),
            // partials
            page: 'page',
            cache: 'cache',
        };
        this.route = {
            root: '/doc',
            // security
            login: '/doc/auth/login',
            logout: '/doc/auth/logout',
            access: '/doc/auth/access',
            // partials
            api: '/api',
            src: '/src',
        };
        this.template = {
            layout: path.join(__dirname, './template/'),
            login: '/doc/auth/login',
            404: '/doc/auth/login',
        };
    }

    /**
     * @description configure the Document module 
     * @param {Object} option 
     * @returns {DocumentModule} self
     */
    configure(option) {
        typeof option === "object" && this.inject(option);
        this.contentService?.inject({
            dataService: this.dataService || null,
            tplService: this.tplService || null,
            logger: this.logger || null,
            template: this.template,
            route: this.route,
            path: this.path,
            cfg: this.cfg
        });
        this.controller?.inject({
            contentService: this.contentService || null,
            sessionService: this.sessionService || null,
            authService: this.authService || null,
            logger: this.logger || null
        });
        return this;
    }

    /**
     * 
     * @param {Object} [app] 
     * @param {Function|null} [publish] 
     * @param {Object|null} [cfg] 
     */
    init(app, publish, cfg = null) {
        this.cfg = cfg || this.cfg;
        if (typeof app?.use !== "function" || typeof app?.post !== "function") {
            return this;
        }
        const mdCheck = this.session?.check(this.route.access, this.sessionKey, 'simple');
        const mdFormData = this.formData?.support();
        // Resources URL
        app.use("*.css", (req, res, next) => res.set('Content-Type', 'text/css') && next());
        publish instanceof Function && app.use(publish(this.path.resource));
        // Security URL
        app.get(this.route.access, (req, res) => this.controller.access(req, res));
        app.post(this.route.login, (req, res) => this.controller.login(req, res));
        app.get(this.route.logout, (req, res) => this.controller.logout(req, res));
        // Scheme URL 
        app.get(this.route.root + "/:scheme/:id", mdCheck, (req, res) => this.controller.show(req, res));
        app.delete(this.route.root + "/:scheme/:id", mdCheck, (req, res) => this.controller.delete(req, res));
        app.post(this.route.root + "/:scheme/:id", mdCheck, mdFormData, (req, res) => this.controller.save(req, res));
        app.put(this.route.root + "/:scheme/:id", mdCheck, mdFormData, (req, res) => this.controller.save(req, res));
        this.route?.api && app.use(this.route.root + "/:scheme" + this.route?.api, mdCheck, this.apiController.init(this.cfg));
        app.get(this.route.root + "/:scheme", mdCheck, (req, res) => this.controller.show(req, res));
    }
}

module.exports = DocumentModule;