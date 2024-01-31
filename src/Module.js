const ksdp = require('ksdp');
const path = require('path');
const kstpl = require('kstpl');
const utl = require('./utl');

const DocumentController = require('./controller/Document');
const SwaggerController = require('./controller/Swagger');
const ContentService = require('./service/Content');
const SessionService = require('./service/Session');
const formDataMw = require('./middleware/FormData');
const { TConfig } = require('./types');

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
        this.cfg = { ...TConfig };
        this.path = {
            root: path.join(__dirname, '../../../docs'),
            // partials
            resource: '{root}/{scheme}/resource',
            page: '{root}/{scheme}/page',
            cache: '{root}/{scheme}/cache',
            config: '{root}/{scheme}/config',
        };
        this.route = {
            root: '/doc',
            resource: '/resource',
            // security
            login: '{root}/auth/login',
            logout: '{root}/auth/logout',
            access: '{root}/auth/access',
            // partials
            public: '{resource}/{scheme}',
            home: '{root}/{scheme}',
            pag: '{root}/{scheme}/{page}',
            api: '{root}/{scheme}/api',
            src: '{root}/{scheme}/src',
        };
        this.template = {
            default: 'main',
            layout: path.join(__dirname, 'template', 'page.layout.html'),
            login: path.join(__dirname, 'template', 'page.login.html'),
            404: path.join(__dirname, 'template', 'page.404.html'),
            main: path.join(__dirname, 'template', 'snippet.main.html'),
            description: path.join(__dirname, 'template', 'snippet.des.html'),
        };
        this.tplService = kstpl.configure({
            map: { "md": "markdown", "html": "twing", "twig": "twing", "ejs": "ejs", "htmljs": "ejs" },
            ext: "",
            default: "twing",
            path: this.path.page
        });
        this.controller = new DocumentController();
        this.apiController = new SwaggerController();
        this.contentService = new ContentService();
        this.sessionService = new SessionService();
    }

    /**
     * @description configure the Document module 
     * @param {Object} option 
     * @returns {DocumentModule} self
     */
    configure(option) {
        if (typeof option === "object") {
            option.tplService && (this.tplService = option.tplService);
            option.controller && (this.controller = option.controller);
            option.apiController && (this.apiController = option.apiController);
            option.contentService && (this.contentService = option.contentService);
            option.sessionService && (this.sessionService = option.sessionService);
            option.cfg instanceof Object && Object.assign(this.cfg, option.cfg);
            option.path instanceof Object && Object.assign(this.path, option.path);
            option.route instanceof Object && Object.assign(this.route, option.route);
            option.template instanceof Object && Object.assign(this.template, option.template);
        }
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
     * @description initialize the module
     * @param {Object} app
     * @param {Function|null} [publish] 
     * @param {Object|null} [cfg] 
     */
    init(app, publish = null, cfg = null) {
        this.cfg = cfg || this.cfg;
        if (typeof app?.use !== "function" || typeof app?.post !== "function") {
            return this;
        }
        const mdCheck = this.sessionService?.check(utl.mix(this.route.access, this.route), 'docs', 'simple');
        const mdFormData = formDataMw?.support();
        this.apiController?.configure({ cfg: this.cfg, path: this.path });
        // Resources URL
        app.use("*.css", (req, res, next) => res.set('Content-Type', 'text/css') && next());
        publish instanceof Function && app.use(utl.mix(this.route.public, { ...this.route, scheme: ":scheme" }), (req, res, next) => {
            const scheme = req.params.scheme;
            const resouce = path.resolve(utl.mix(this.path.resource, { ...this.path, scheme }));
            publish(resouce)(req, res, next);
        });
        // Security URL
        app.get(utl.mix(this.route.login, this.route), (req, res) => this.controller.login(req, res));
        app.get(utl.mix(this.route.logout, this.route), (req, res) => this.controller.logout(req, res));
        app.get(utl.mix(this.route.access, this.route), (req, res) => this.controller.access(req, res));
        // Scheme URL 
        app.get(this.route.root + "/:scheme/:id", mdCheck, (req, res) => this.controller.show(req, res));
        app.delete(this.route.root + "/:scheme/:id", mdCheck, (req, res) => this.controller.delete(req, res));
        app.post(this.route.root + "/:scheme/:id", mdCheck, mdFormData, (req, res) => this.controller.save(req, res));
        app.put(this.route.root + "/:scheme/:id", mdCheck, mdFormData, (req, res) => this.controller.save(req, res));
        this.route?.api && app.use(utl.mix(this.route.api, { ...this.route, scheme: ":scheme" }), mdCheck, ...this.apiController.init());
        app.get(this.route.root + "/:scheme", mdCheck, (req, res) => this.controller.show(req, res));
    }
}

module.exports = DocumentModule;