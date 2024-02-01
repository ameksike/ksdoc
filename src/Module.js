const ksdp = require('ksdp');
const path = require('path');
const kstpl = require('kstpl');
const utl = require('./utl');

const DocumentController = require('./controller/Document');
const SwaggerController = require('./controller/Swagger');
const ContentService = require('./service/Content');
const SessionService = require('./service/Session');
const LanguageService = require('./service/Language');
const ConfigService = require('./service/Config');
const MenuService = require('./service/Menu');

const formDataMw = require('./middleware/FormData');
const { TConfig } = require('./types');

class DocumentModule extends ksdp.integration.Dip {
    /**
     * @description Document Controller
     * @type {DocumentController|null}
     */
    controller;

    /**
     * @description Document Controller
     * @type {SwaggerController|null}
     */
    apiController;

    /**
     * @description Content Service
     * @type {ContentService|null}
     */
    contentService;

    /**
     * @description Session Service
     * @type {SessionService|null}
     */
    sessionService;

    /**
     * @description Config Service
     * @type {ConfigService|null}
     */
    configService;

    /**
     * @description Language Service
     * @type {LanguageService|null}
     */
    languageService;

    /**
     * @description Menu Service
     * @type {MenuService|null}
     */
    menuService;

    /**
     * @description Authorization Service
     * @type {Object|null}
     */
    authService;

    /**
     * @description Data Service
     * @type {Object|null}
     */
    dataService;

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
            lib: __dirname,
            root: path.join(__dirname, '../../../docs'),
            // partials
            api: '{root}/{scheme}/api',
            page: '{root}/{scheme}/page',
            lang: '{root}/{scheme}/lang',
            config: '{root}/{scheme}/config',
            resource: '{root}/{scheme}/resource',
            core: '{root}/{scheme}/_',
            cache: '{core}/cache',
        };
        this.route = {
            root: '/doc',
            resource: '/resource',
            // security
            login: '{root}/{scheme}/sec/login',
            logout: '{root}/{scheme}/sec/logout',
            access: '{root}/{scheme}/sec/access',
            unauthorized: '{root}/{scheme}/sec/access',
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
            login: path.join(__dirname, 'template', 'snippet.login.html'),
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
        this.languageService = new LanguageService();
        this.configService = new ConfigService({
            path: this.path
        });
        this.menuService = new MenuService({
            path: this.path,
            route: this.route,
            cfg: this.cfg
        });
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
            option.authService && (this.authService = option.authService);
            option.dataService && (this.dataService = option.dataService);
            option.cfg instanceof Object && Object.assign(this.cfg, option.cfg);
            option.path instanceof Object && Object.assign(this.path, option.path);
            option.route instanceof Object && Object.assign(this.route, option.route);
            option.template instanceof Object && Object.assign(this.template, option.template);
        }
        this.configService?.configure({
            path: this.path,
            filename: option?.filename
        });
        this.menuService?.configure({
            path: this.path,
            route: this.route,
            cfg: this.cfg
        });
        this.contentService?.inject({
            menuService: this.menuService || null,
            configService: this.configService || null,
            languageService: this.languageService || null,
            dataService: this.dataService || null,
            tplService: this.tplService || null,
            logger: this.logger || null,
            template: this.template,
            route: this.route,
            path: this.path,
            cfg: this.cfg
        });
        this.controller?.inject({
            configService: this.configService || null,
            contentService: this.contentService || null,
            sessionService: this.sessionService || null,
            authService: this.authService || null,
            logger: this.logger || null,
            route: this.route,
            path: this.path,
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
        const routed = { ...this.route, scheme: ":scheme" };
        const mdCheck = this.sessionService?.check(utl.mix(this.route.access, routed), 'docs', 'simple');
        const mdFormData = formDataMw?.support();
        this.apiController?.configure({ cfg: this.cfg, path: this.path });
        // Resources URL
        publish instanceof Function && app.use("/ksdoc", publish(path.join(__dirname, "webcomponet")));
        publish instanceof Function && app.use(utl.mix(this.route.public, routed), (req, res, next) => {
            const scheme = req.params.scheme;
            const resouce = path.resolve(utl.mix(this.path.resource, { ...this.path, scheme }));
            publish(resouce)(req, res, next);
        });
        // Security URL
        app.post(utl.mix(this.route.login, routed), (req, res) => this.controller.login(req, res));
        app.get(utl.mix(this.route.logout, routed), (req, res) => this.controller.logout(req, res));
        app.get(utl.mix(this.route.access, routed), (req, res) => this.controller.access(req, res));
        // Scheme API URL 
        this.route?.api && this.apiController && app.use(
            utl.mix(this.route.api, routed),
            this.apiController.middlewares(),
            (req, res, next) => {
                const scheme = req.params.scheme;
                const option = {
                    scheme,
                    path: path.resolve(utl.mix(this.path.api, { ...this.path, scheme }))
                };
                const action = this.configure().apiController.init(this.cfg, option);
                action instanceof Function && action(req, res, next);
            }
        );
        // Scheme URL 
        app.get(this.route.root + "/:scheme/:id", mdCheck, (req, res) => this.configure().controller.show(req, res));
        app.delete(this.route.root + "/:scheme/:id", mdCheck, (req, res) => this.configure().controller.delete(req, res));
        app.post(this.route.root + "/:scheme/:id", mdCheck, mdFormData, (req, res) => this.configure().controller.save(req, res));
        app.put(this.route.root + "/:scheme/:id", mdCheck, mdFormData, (req, res) => this.configure().controller.save(req, res));
        app.get(this.route.root + "/:scheme", mdCheck, (req, res) => this.configure().controller.show(req, res));
    }
}

module.exports = DocumentModule;