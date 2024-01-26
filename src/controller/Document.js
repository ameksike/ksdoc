const ksmf = require('ksmf');
const ksdp = require('ksdp');
const path = require('path');

const utl = ksmf.app.Utl.self();
const uri = ksmf.app.Url.self();

const ContentManager = require('../service/ContentManager');
const SwaggerManager = require('../service/SwaggerManager');

class Documentor extends ksdp.integration.Dip {

    /**
     * @description middleware
     * @type {Console|null}
     */
    formData = null;

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
    authorizationService = null;

    /**
     * @type {ContentManager|null}
     */
    contentManager = null;

    constructor() {
        super();

        this.contentManager = new ContentManager();
        this.swaggerManager = new SwaggerManager();


        this.path = path.join(__dirname, '../../../docs');

        this.route = '/doc';
        this.exts = '.html';
        this.cfg = {};
        this.js = [];
        this.css = [];
        this.keys = {};
        this.menu = {};
        this.sessionKey = 'doc';
        this.view = this.route + '/view';

        this.viewAccess = this.view + '/auth/access';
        this.viewLogin = this.view + '/auth/login';
        this.viewLogout = this.view + '/auth/logout';
        this.tplHandler = new ksmf.view.Tpl();
    }

    setting(configDoc) {
        this.path = configDoc?.path ? path.join(__dirname, '../../../', configDoc.path) : this.path;
        this.route = configDoc?.route || this.route;
        this.exts = configDoc?.exts || this.exts;
        this.cfg = configDoc?.swagger || this.cfg;
        this.js = configDoc?.js || this.js;
        this.css = configDoc?.css || this.css;
        this.keys = configDoc?.keys || this.keys;
        this.menu = configDoc?.menu || this.menu;
        this.sessionKey = configDoc?.sessionKey || this.sessionKey;
        this.view = configDoc?.view || this.view;

        this.viewAccess = this.view + '/auth/access';
        this.viewLogin = this.view + '/auth/login';
        this.viewLogout = this.view + '/auth/logout';
        return this;
    }

    /**
     * 
     * @param {Object} [app] 
     * @param {Object} [cfg] 
     */
    init(app, cfg) {
        this.cfg = cfg || this.cfg;

        if (app.use) {
            app.use("*.css", (req, res, next) => res.set('Content-Type', 'text/css') && next());
            app.get(this.viewAccess, (req, res) => this.access(req, res));
            app.post(this.viewLogin, (req, res) => this.login(req, res));
            app.get(this.viewLogout, (req, res) => this.logout(req, res));

            app.get(this.view + "/:type/:id", this.session?.check(this.viewAccess, this.sessionKey, 'simple'), (req, res) => this.show(req, res));
            app.delete(this.view + "/:type/:id", (req, res) => this.delete(req, res));
            app.get(this.view + "/:id", (req, res) => this.show(req, res));
            app.get(this.view, this.session?.check(this.viewAccess, this.sessionKey, 'simple'), (req, res) => this.show(req, res));
            app.post(this.view, this.formData?.support(), (req, res) => this.save(req, res));

            this.swaggerManager.init(app, this.cfg);
        }
    }

    /**
     * @description render the document content 
     * @param {Request} req 
     * @param {Response} res 
     */
    async show(req, res) {
        let account = this.session?.account(req, "doc");
        let pageid = req.params.id || "";
        let typeid = req.params.type || this.keys.pages;
        let ttoken = this.session?.getToken(req);
        let atoken = ttoken ? "?token=" + ttoken : "";
        let content = !pageid ? '' : await this.tplHandler.render(
            path.join(this.path, typeid, pageid + this.exts),
            await this.content.getData({ name: pageid, flow: req.flow, token: ttoken })
        );
        content = content || await this.tplHandler.render(
            path.join(this.path, typeid, "../" + this.keys.main + this.exts),
            await this.content.getData({ name: this.keys.main, flow: req.flow, token: ttoken })
        ) || "";
        let topics = this.loadMenu(this.path, this.keys.topics, null, atoken);
        let pages = this.menu?.pages === false ? "" : this.loadMenu(this.path, this.keys?.pages, null, atoken);
        let layout = await this.tplHandler.render(
            path.join(this.path, this.keys.layout + this.exts),
            {
                content, topics, pages, account: {
                    name: account?.user?.firstName || "Guest"
                },
                logout: this.viewLogout,
                token: ttoken
            }
        );
        res.send(layout);
    }

    /**
     * @description add or update documents 
     * @param {Request} req 
     * @param {Response} res 
     */
    async save(req, res) {
        let params = utl.getFrom(req)
        let { content, title = "default", index, type = this.keys.pages, id } = params;
        if (!content) {
            return res.status(400).send({
                success: false,
                msg: "E_BAD_REQUEST",
            });
        }
        try {
            const filename = await this.contentManager?.save({ path: this.path, id, index, title, type, content });
            this.logger?.info({
                flow: req.flow,
                src: "service:doc:save",
                data: { filename }
            });
            res.send({ success: true, msg: "SAVE_OK", data: { page: type + "/" + id } });
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: "service:doc:save",
                error: { message: error?.message || error, stack: error?.stack },
                data: req.body
            });
            res.status(500).send({
                success: false,
                msg: "E_BAD_REQUEST",
            })
        }
    }

    /**
     * @description delete documents 
     * @param {Request} req 
     * @param {Response} res 
     */
    async delete(req, res) {
        try {
            let { id, type = this.keys.pages } = utl.getFrom(req);
            if (!id) {
                return res.status(400).send({
                    success: false,
                    msg: "E_BAD_REQUEST",
                });
            }
            let filename = await this.contentManager?.delete({ id, type, exts: this.exts, path: this.path });
            this.logger?.info({
                flow: req.flow,
                src: "service:doc:delete",
                data: { filename }
            });
            res.send({ success: true, msg: "DELETE_OK", data: { page: type + "/" + id } });
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: "service:doc:delete",
                error: { message: error?.message || error, stack: error?.stack },
                data: req.body
            });
            res.status(500).send({
                success: false,
                msg: "E_BAD_REQUEST",
            })
        }
    }

    /**
     * @description 
     * @param {Request} req 
     * @param {Response} res 
     */
    async access(req, res) {
        try {
            const topics = this.loadMenu(this.path, this.keys.topics);
            const pages = this.menu?.pages === false ? "" : this.loadMenu(this.path, this.keys?.pages);
            const content = await this.tplHandler.render(path.join(this.path, "login.html"), {
                check: this.viewLogin + (req.query.mode ? "?mode=" + req.query.mode : "")
            });
            const layout = await this.tplHandler.render(
                path.join(this.path, this.keys.layout + this.exts),
                {
                    content, topics, pages, account: {
                        name: "Guest"
                    },
                    msg: req.query.msg,
                    logout: this.viewLogout
                }
            );
            res.send(layout);
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: "service:doc:access",
                error: { message: error?.message || error, stack: error?.stack },
                data: req.body
            });
            this.session?.remove(req, this.sessionKey);
            res.status(500).send({
                success: false,
                msg: "E_BAD_REQUEST",
            });
        }
    }

    /**
     * @description login action
     * @param {Request} req 
     * @param {String} [req.flow] 
     * @param {Response} res 
     */
    async login(req, res) {
        try {
            if (req.body.grant_type !== "password") {
                throw new Error("Incorrect Grant Type");
            }
            let mode = req.query.mode;
            let payload = await this.authorizationService?.getROPCredentials({
                client_id: req.body.client_id,
                client_secret: req.body.client_secret,
                username: req.body.username,
                password: req.body.password,
                scope: req.body.scope,
                user_agent: req.body.user_agent,
                flow: req.flow
            });
            if (!payload) {
                throw new Error("Authentication Failed");
            }
            this.session?.create(req, this.sessionKey, { access_token: payload.access_token, flow: req.flow });
            let sess = this.session?.account(req, this.sessionKey);
            let rurl = sess?.originalUrl || req.query.redirectUrl || this.view;
            this.logger?.info({
                flow: req.flow,
                src: "service:doc:login",
                data: { rurl }
            });
            if (mode === "in") {
                rurl = uri.add(rurl, { token: payload.access_token }, req);
            }
            res.redirect(rurl);
        }
        catch (error) {
            this.session?.remove(req, this.sessionKey);
            let urlr = uri.add(this.viewAccess, { msg: "Invalid user" }, req);
            this.logger?.error({
                flow: req.flow,
                src: "service:doc:login",
                error: { message: error?.message || error, stack: error?.stack },
                data: { ...req.body, redirect: urlr }
            });
            res.redirect(urlr);
        }
    }

    /**
     * 
     * @param {Object} req 
     * @param {String} [req.flow] 
     * @param {Object} res 
     */
    async logout(req, res) {
        try {
            this.session?.remove(req, this.sessionKey);
            res.redirect(this.viewAccess);
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: "service:doc:logout",
                error: { message: error?.message || error, stack: error?.stack },
                data: req.body
            });
            res.status(500).send({
                success: false,
                msg: "E_BAD_REQUEST",
            })
        }
    }
}

module.exports = Documentor;