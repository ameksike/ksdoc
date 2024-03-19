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
const SessionService = ksmf.server.Session;
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
            "api": "{root}/{schema}/api",
            "page": "{root}/{schema}/page",
            "lang": "{root}/{schema}/lang",
            "config": "{root}/{schema}/config",
            "resource": "{root}/{schema}/resource",
            "core": "{root}/{schema}/core",
            "cache": "{core}/cache",
        };
        this.route = {
            "lang": "en",
            "root": "/doc",
            "resource": "/resource",
            // partials
            "base": "{root}/{lang}",
            "public": "{resource}/{schema}",
            "home": "{base}/{schema}",
            "pag": "{base}/{schema}/{page}",
            "api": "{base}/{schema}/api",
            "src": "{base}/{schema}/src",
            // security
            "login": "{base}/{schema}/sec/login",
            "logout": "{base}/{schema}/sec/logout",
            "access": "{base}/{schema}/sec/access",
            "unauthorized": "{base}/{schema}/sec/access",
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
     * @param {Object|null} option 
     * @returns {DocumentModule} self
     */
    configure(option = null) {
        option = option || {};
        // controllers 
        !option.schemaController && (option.schemaController = this.schemaController);
        !option.contentController && (option.contentController = this.contentController);
        !option.apiController && (option.apiController = this.apiController);
        // services 
        !option.schemaService && (option.schemaService = this.schemaService);
        !option.contentService && (option.contentService = this.contentService);
        !option.languageService && (option.languageService = this.languageService);
        !option.sessionService && (option.sessionService = this.sessionService);
        !option.configService && (option.configService = this.configService);
        !option.authService && (option.authService = this.authService);
        !option.dataService && (option.dataService = this.dataService);
        !option.menuService && (option.menuService = this.menuService);
        // utils 
        !option.logger && (option.logger = this.logger);
        !option.tplService && (option.tplService = this.tplService);
        // options 
        option.cfg = { ...this.cfg, ...option.cfg };
        option.path = { ...this.path, ...option.path };
        option.route = { ...this.route, ...option.route };
        option.template = { ...this.template, ...option.template };
        // configure
        this.configService?.configure({
            path: option.path,
            logger: option.logger || null,
            filename: option?.filename
        });
        this.menuService?.configure({
            logger: option.logger || null,
            path: option.path,
            route: option.route,
            cfg: option.cfg
        });
        const diService = {
            languageService: option.languageService || null,
            configService: option.configService || null,
            menuService: option.menuService || null,
            dataService: option.dataService || null,
            tplService: option.tplService || null,
            template: option.template,
            logger: option.logger || null,
            route: option.route,
            path: option.path,
            cfg: option.cfg
        };
        this.sessionService?.inject({
            authService: option.authService || null
        });
        this.contentService?.inject(diService);
        this.schemaService?.inject(diService);
        this.schemaController?.inject(option);
        this.contentController?.inject(option);
        this.apiController?.inject(option)
        return this;
    }

    /**
     * @description schema reconfiguration
     * @param {Object} [req] 
     * @param {Object} [req.ksdoc] 
     * @param {Object} [req.params] 
     * @param {String} [req.params.schema] 
     * @returns {Promise<DocumentModule>} self
     */
    async load(req) {
        let option = req?.ksdoc;
        if (typeof req?.params?.schema === "string" && req?.params?.schema) {
            option = await this.configService?.load(req?.params, this.contentService);
            req.ksdoc = option;
        }
        return this.configure(option);
    }

    /**
     * @description controller delegation 
     * @param {Object} req 
     * @param {Object} res 
     * @param {Object} next 
     * @param {String} srv 
     * @param {String} act 
     */
    async delegate(req, res, next, srv, act) {
        await this.load(req);
        let self = this;
        if (srv && act && typeof self[srv] === "object" && self[srv][act] instanceof Function) {
            return self[srv][act](req, res, next);
        }
        return next();
    }

    /**
     * @description initialize the module
     * @param {Object} app
     * @param {Function|null} [publish] 
     * @param {Object|null} [cfg] 
     */
    init(app, publish = null, cfg = null) {
        this.cfg = cfg || this.cfg;
        this.configure();
        if (typeof app?.use !== "function" || typeof app?.post !== "function") {
            return this;
        }
        const routed = { ...this.route, schema: ":schema", lang: ":lang" };
        const mwCheck = (req, res, next) => this.delegate(req, res, next, "contentController", "check");
        const mwFormData = formDataMw?.support();
        // Resources URL
        publish instanceof Function && app.use("/ksdoc", publish(path.join(__dirname, "webcomponet")));
        publish instanceof Function && app.use(utl.mix(this.route.public, routed), (req, res, next) => {
            const schema = req.params.schema;
            const resouce = path.resolve(utl.mix(this.path.resource, { ...this.path, schema }));
            publish(resouce)(req, res, next);
        });
        // Security URL
        app.post(utl.mix(this.route.login, routed), (req, res, next) => this.delegate(req, res, next, "contentController", "login"));
        app.get(utl.mix(this.route.logout, routed), (req, res, next) => this.delegate(req, res, next, "contentController", "logout"));
        app.get(utl.mix(this.route.access, routed), (req, res, next) => this.delegate(req, res, next, "contentController", "access"));
        // Content API URL
        this.route?.api && this.apiController?.configure({ cfg: this.cfg, path: this.path }) && app.use(
            utl.mix(this.route.api, routed),
            mwCheck,
            this.apiController.middlewares(),
            async (req, res, next) => {
                await this.load(req);
                const schema = req.params.schema;
                const lang = req.params.lang;
                const token = this.sessionService?.getToken(req);
                const account = this.sessionService?.account(req, this.cfg?.session?.key);
                const option = {
                    ...req.query,
                    account,
                    schema,
                    token,
                    flow: req.flow,
                    lang,
                    path: path.resolve(utl.mix(this.path?.api, { ...this.path, schema, lang }))
                };
                const action = await this.apiController?.init(this.cfg, option, req.ksdoc);
                action instanceof Function && action(req, res, next);
            }
        );
        // Content URL 
        let baseUrl = this.getRoute("base", { lang: ":lang" });
        app.get(baseUrl + "/:schema/:id", mwCheck, (req, res, next) => this.delegate(req, res, next, "contentController", "show"));
        app.delete(baseUrl + "/:schema/:id", mwCheck, (req, res, next) => this.delegate(req, res, next, "contentController", "delete"));
        app.post(baseUrl + "/:schema/:id", mwCheck, mwFormData, (req, res, next) => this.delegate(req, res, next, "contentController", "save"));
        app.put(baseUrl + "/:schema/:id", mwCheck, mwFormData, (req, res, next) => this.delegate(req, res, next, "contentController", "save"));
        app.get(baseUrl + "/:schema", mwCheck, (req, res, next) => this.delegate(req, res, next, "contentController", "show"));
        // schema URL 
        app.get(baseUrl, (req, res, next) => this.delegate(req, res, next, "schemaController", "show"));
        app.get(this.getRoute("root"), (req, res, next) => res.redirect(this.getRoute("base")));
    }
}

module.exports = DocumentModule;