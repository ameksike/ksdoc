const ksmf = require('ksmf');
const ksdp = require('ksdp');

const utl = ksmf.app.Utl.self();
const uri = ksmf.app.Url.self();
const uts = require('../utl');

class ContentController extends ksdp.integration.Dip {

    /**
     * @description Document Controller
     * @type {Object|null}
     */
    configService;

    /**
     * @type {Console|null}
     */
    logger = null;

    /**
     * @type {Object|null}
     */
    sessionService = null;

    /**
     * @type {Object|null}
     */
    authService = null;

    /**
     * @type {Object|null}
     */
    contentService = null;

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
     * @description all configurations 
     * @type {Object}
     */
    cfg;

    /**
     * @description render the document content 
     * @param {Object} req 
     * @param {Object} res 
     */
    async show(req, res) {
        try {
            let scheme = req.params.scheme;
            let config = req.config = req.config || await this.configService?.load({ scheme }, this.contentService);
            let token = this.sessionService?.getToken(req);
            let account = this.sessionService?.account(req, this.cfg?.session?.key);
            let pageid = req.params.id || "";
            let layout = await this.contentService.select({ token, account, pageid, scheme, query: req.query, config });
            res.send(layout);
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: "KsDoc:check",
                error: { message: error?.message || error, stack: error?.stack },
                data: req.body
            });
            res.status(500).end();
        }

    }

    /**
     * @description check user sessions 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async check(req, res, next) {
        try {
            let scheme = req.params.scheme;
            let config = req.config = req.config || await this.configService?.load({ scheme }, this.contentService);
            if (!this.sessionService || !config?.cfg?.auth?.required) {
                return next();
            }
            let option = {
                scheme,
                pageid: req.params.id,
                originalUrl: req.url || req.originalUrl,
                redirectUrl: uts.mix(this.route.access, { ...this.route, scheme }),
                key: this.cfg?.session?.key,
                mode: 'simple'
            }
            const validated = await this.sessionService?.check(option, { req, res, next });
            if (validated !== undefined) {
                if (validated) {
                    return next();
                } else {
                    this.sessionService?.create(req, this.cfg?.session?.key, { originalUrl: option.originalUrl });
                    return res.redirect(uri.add(option.redirectUrl, { msg: "error_invalid_user", ...req.query }, req));
                }
            }
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: "KsDoc:check",
                error: { message: error?.message || error, stack: error?.stack },
                data: req.body
            });
            next();
        }
    }

    /**
     * @description add or update documents 
     * @param {Object} req 
     * @param {Object} res 
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
            const filename = await this.contentService?.save({ path: this.path, id, index, title, type, content });
            this.logger?.info({
                flow: req.flow,
                src: "KsDoc:save",
                data: { filename }
            });
            res.send({ success: true, msg: "SAVE_OK", data: { page: type + "/" + id } });
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: "KsDoc:save",
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
     * @param {Object} req 
     * @param {Object} res 
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
            let filename = await this.contentService?.delete({ id, type, exts: this.exts, path: this.path });
            this.logger?.info({
                flow: req.flow,
                src: "KsDoc:delete",
                data: { filename }
            });
            res.send({ success: true, msg: "DELETE_OK", data: { page: type + "/" + id } });
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: "KsDoc:delete",
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
     * @description show the login page
     * @param {Object} req 
     * @param {Object} res 
     */
    async access(req, res) {
        try {
            let scheme = req.params.scheme;
            let config = req.config = req.config || await this.configService?.load({ scheme }, this.contentService);
            let token = this.sessionService?.getToken(req);
            let account = this.sessionService?.account(req, this.cfg?.session?.key);
            let layout = await this.contentService.select({ token, account, pageid: "login", scheme, query: req.query, config });
            res.send(layout);
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: "KsDoc:access",
                error: { message: error?.message || error, stack: error?.stack },
                data: req.body
            });
            this.sessionService?.remove(req, this.cfg?.session?.key);
            res.status(500).send({
                success: false,
                msg: "E_BAD_REQUEST",
            });
        }
    }

    /**
     * @description login action
     * @param {Object} req 
     * @param {String} [req.flow] 
     * @param {Object} [req.body] 
     * @param {String} [req.body.client_id] 
     * @param {String} [req.body.client_secret] 
     * @param {String} [req.body.username] 
     * @param {String} [req.body.password] 
     * @param {String} [req.body.scope] 
     * @param {String} [req.body.user_agent] 
     * @param {String} [req.body.grant_type] 
     * @param {Object} [req.query] 
     * @param {String} [req.query.redirectUrl] 
     * @param {String} [req.query.scheme] 
     * @param {String} [req.query.mode] 
     * @param {Object} [req.headers] 
     * @param {Object} [req.params] 
     * @param {Object} res 
     */
    async login(req, res) {
        let scheme = req.params.scheme;
        try {
            if (req.body.grant_type !== "password") {
                throw new Error("Incorrect Grant Type");
            }
            let mode = req.query.mode;
            let payload = await this.authService?.check({
                client_id: req.body.client_id,
                client_secret: req.body.client_secret,
                username: req.body.username,
                password: req.body.password,
                scope: req.body.scope,
                user_agent: req.body.user_agent || req.headers["user-agent"],
                flow: req.flow
            });
            if (!payload) {
                throw new Error("Authentication Failed");
            }
            this.sessionService?.create(req, this.cfg?.session?.key, { access_token: payload.access_token, flow: req.flow });
            let sess = this.sessionService?.account(req, this.cfg?.session?.key);
            let orgu = sess?.originalUrl || req.query.redirectUrl;
            let rurl = orgu && orgu !== "/" ? orgu : uts.mix(this.route.home, { ...this.route, scheme });
            this.logger?.info({
                flow: req.flow,
                src: "KsDoc:login",
                data: { rurl }
            });
            if (mode === "in") {
                rurl = uri.add(rurl, { token: payload.access_token }, req);
            }
            res.redirect(rurl);
        }
        catch (error) {
            this.sessionService?.remove(req, this.cfg?.session?.key);
            let urlr = uts.mix(this.route.unauthorized, { ...this.route, scheme });
            urlr = uri.add(urlr, { msg: "Invalid user" }, req);
            this.logger?.error({
                flow: req.flow,
                src: "KsDoc:login",
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
     * @param {Object} [req.body] 
     * @param {Object} [req.params] 
     * @param {String} [req.params.scheme] 
     * @param {Object} res 
     */
    async logout(req, res) {
        try {
            this.sessionService?.remove(req, this.cfg?.session?.key);
            const scheme = req.params.scheme;
            const redurectUrl = uts.mix(this.route.unauthorized, { ...this.route, scheme });
            res.redirect(redurectUrl);
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: "KsDoc:logout",
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

module.exports = ContentController;