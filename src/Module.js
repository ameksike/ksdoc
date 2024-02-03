const ksdp = require('ksdp');
const path = require('path');
const kstpl = require('kstpl');
const ksmf = require('ksmf');
// controllers 
const ContentController = require('./controller/Content');
const SwaggerController = require('./controller/Swagger');
const SchemaController = require('./controller/Schema');
// services 
const SchemaService = require('./service/Schema');
const ContentService = require('./service/Content');
const LanguageService = require('./service/Language');
const ConfigService = require('./service/Config');
const MenuService = require('./service/Menu');
const SessionService = ksmf.monitor.Session;
// utils 
const formDataMw = require('./middleware/FormData');
const { TConfig } = require('./types');
const utl = require('./utl');

class DocumentModule extends ksdp.integration.Dip {
    /**
     * @description Document Controller
     * @type {ContentController|null}
     */
    contentController;

    /**
     * @description Schema Controller
     * @type {SchemaController|null}
     */
    schemaController;

    /**
     * @description Document Controller
     * @type {SwaggerController|null}
     */
    apiController;

    /**
     * @description Content Service
     * @type {SchemaService|null}
     */
    schemaService;

    /**
     * @description Content Service
     * @type {ContentService|null}
     */
    contentService;

    /**
     * @description Session Service
     * @type {Object|null}
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
            core: '{root}/{scheme}/core',
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
            home: path.join(__dirname, 'template', 'page.home.html'),
            layout: path.join(__dirname, 'template', 'page.layout.html'),
            login: path.join(__dirname, 'template', 'snippet.login.html'),
            404: path.join(__dirname, 'template', 'page.404.html'),
            main: path.join(__dirname, 'template', 'snippet.main.html'),
            desc: path.join(__dirname, 'template', 'fragment.des.html'),
        };
        this.tplService = kstpl.configure({
            map: { "md": "markdown", "html": "twing", "twig": "twing", "ejs": "ejs", "htmljs": "ejs" },
            ext: "",
            default: "twing",
            path: this.path.page
        });
        this.schemaController = new SchemaController();
        this.contentController = new ContentController();
        this.apiController = new SwaggerController();
        this.schemaService = new SchemaService();
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
     * @description resolve URL
     * @param {String} key 
     * @param {Object} option 
     * @returns {String} url
     */
    getRoute(key, option) {
        const routed = { ...this.route, ...option };
        return utl.mix(this.route[key], routed) || "";
    }

    /**
     * @description configure the Document module 
     * @param {Object} option 
     * @returns {DocumentModule} self
     */
    configure(option) {
        if (typeof option === "object") {
            // controllers 
            option.schemaController && (this.schemaController = option.schemaController);
            option.contentController && (this.contentController = option.contentController);
            option.apiController && (this.apiController = option.apiController);
            // services 
            option.tplService && (this.tplService = option.tplService);
            option.contentService && (this.contentService = option.contentService);
            option.sessionService && (this.sessionService = option.sessionService);
            option.authService && (this.authService = option.authService);
            option.dataService && (this.dataService = option.dataService);
            // utils 
            option.logger && (this.logger = option.logger);
            // options 
            option.cfg instanceof Object && Object.assign(this.cfg, option.cfg);
            option.path instanceof Object && Object.assign(this.path, option.path);
            option.route instanceof Object && Object.assign(this.route, option.route);
            option.template instanceof Object && Object.assign(this.template, option.template);
        }
        this.configService?.configure({
            path: this.path,
            logger: this.logger || null,
            filename: option?.filename
        });
        this.menuService?.configure({
            logger: this.logger || null,
            path: this.path,
            route: this.route,
            cfg: this.cfg
        });
        const diService = {
            languageService: this.languageService || null,
            configService: this.configService || null,
            menuService: this.menuService || null,
            dataService: this.dataService || null,
            tplService: this.tplService || null,
            template: this.template,
            logger: this.logger || null,
            route: this.route,
            path: this.path,
            cfg: this.cfg
        };
        const diController = {
            sessionService: this.sessionService || null,
            contentService: this.contentService || null,
            schemaService: this.schemaService || null,
            configService: this.configService || null,
            authService: this.authService || null,
            dataService: this.dataService || null,
            logger: this.logger || null,
            route: this.route,
            path: this.path,
            cfg: this.cfg
        };
        this.sessionService?.inject({
            authService: this.authService || null
        });
        this.contentService?.inject(diService);
        this.schemaService?.inject(diService);
        this.schemaController?.inject(diController);
        this.contentController?.inject(diController);
        this.apiController?.inject(diController)
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
        const mwCheck = (req, res, next) => this.contentController.check(req, res, next);
        const mwFormData = formDataMw?.support();
        // Resources URL
        publish instanceof Function && app.use("/ksdoc", publish(path.join(__dirname, "webcomponet")));
        publish instanceof Function && app.use(utl.mix(this.route.public, routed), (req, res, next) => {
            const scheme = req.params.scheme;
            const resouce = path.resolve(utl.mix(this.path.resource, { ...this.path, scheme }));
            publish(resouce)(req, res, next);
        });
        // Security URL
        app.post(utl.mix(this.route.login, routed), (req, res) => this.contentController.login(req, res));
        app.get(utl.mix(this.route.logout, routed), (req, res) => this.contentController.logout(req, res));
        app.get(utl.mix(this.route.access, routed), (req, res) => this.contentController.access(req, res));
        // Content API URL
        this.route?.api && this.apiController?.configure({ cfg: this.cfg, path: this.path }) && app.use(
            utl.mix(this.route.api, routed),
            mwCheck,
            this.apiController.middlewares(),
            async (req, res, next) => {
                const scheme = req.params.scheme;
                const token = this.sessionService?.getToken(req);
                const account = this.sessionService?.account(req, this.cfg?.session?.key);
                const option = {
                    flow: req.flow,
                    ...req.query,
                    token,
                    account,
                    scheme,
                    path: path.resolve(utl.mix(this.path.api, { ...this.path, scheme }))
                };
                const action = await this.configure().apiController.init(this.cfg, option);
                action instanceof Function && action(req, res, next);
            }
        );
        // Content URL 
        app.get(this.route.root + "/:scheme/:id", mwCheck, (req, res) => this.configure().contentController.show(req, res));
        app.delete(this.route.root + "/:scheme/:id", mwCheck, (req, res) => this.configure().contentController.delete(req, res));
        app.post(this.route.root + "/:scheme/:id", mwCheck, mwFormData, (req, res) => this.configure().contentController.save(req, res));
        app.put(this.route.root + "/:scheme/:id", mwCheck, mwFormData, (req, res) => this.configure().contentController.save(req, res));
        app.get(this.route.root + "/:scheme", mwCheck, (req, res) => this.configure().contentController.show(req, res));
        // Scheme URL 
        app.get(this.route.root, (req, res) => this.configure().schemaController.show(req, res));
    }
}

module.exports = DocumentModule;