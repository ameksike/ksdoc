const ksmf = require('ksmf');
const ksdp = require('ksdp');

const utl = ksmf.app.Utl.self();
const uri = ksmf.app.Url.self();
const uts = require('../utl');

class DocumentController extends ksdp.integration.Dip {

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
     * @type {String}
     */
    sessionKey = "docs";

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
     * @description render the document content 
     * @param {Request} req 
     * @param {Response} res 
     */
    async show(req, res) {
        let token = this.sessionService?.getToken(req);
        let account = this.sessionService?.account(req, this.sessionKey);
        let pageid = req.params.id || "";
        let scheme = req.params.scheme;
        let layout = await this.contentService.select({ token, account, pageid, scheme, query: req.query });
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
     * @description 
     * @param {Request} req 
     * @param {Response} res 
     */
    async access(req, res) {
        try {
            let token = this.sessionService?.getToken(req);
            let account = this.sessionService?.account(req, this.sessionKey);
            let scheme = req.params.scheme;
            let layout = await this.contentService.select({ token, account, pageid: "login", scheme, query: req.query });
            res.send(layout);
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: "KsDoc:access",
                error: { message: error?.message || error, stack: error?.stack },
                data: req.body
            });
            this.sessionService?.remove(req, this.sessionKey);
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
            this.sessionService?.create(req, this.sessionKey, { access_token: payload.access_token, flow: req.flow });
            let sess = this.sessionService?.account(req, this.sessionKey);
            let rurl = sess?.originalUrl || req.query.redirectUrl || uts.mix(this.route.home, { ...this.route, scheme });
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
            this.sessionService?.remove(req, this.sessionKey);
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
     * @param {Object} res 
     */
    async logout(req, res) {
        try {
            this.sessionService?.remove(req, this.sessionKey);
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

module.exports = DocumentController;