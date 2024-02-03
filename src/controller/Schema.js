const ksdp = require('ksdp');
const uts = require('../utl');

class SchemaController extends ksdp.integration.Dip {

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
    schemaService = null;

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
     * @param {Object} req 
     * @param {Object} res 
     */
    async show(req, res) {
        if (this.cfg?.schema?.default) {
            let redirectURl = uts.mix(this.route.home, { ...this.route, scheme: this.cfg.schema.default });
            return res.redirect(redirectURl);
        }
        let token = this.sessionService?.getToken(req);
        let account = this.sessionService?.account(req, this.cfg?.session?.key);
        let layout = await this.schemaService.select({ token, account, query: req.query });
        res.send(layout);
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
                src: "KsDoc:Schema:save",
                data: { filename }
            });
            res.send({ success: true, msg: "SAVE_OK", data: { page: type + "/" + id } });
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: "KsDoc:Schema:save",
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
                src: "KsDoc:Schema:delete",
                data: { filename }
            });
            res.send({ success: true, msg: "DELETE_OK", data: { page: type + "/" + id } });
        }
        catch (error) {
            this.logger?.error({
                flow: req.flow,
                src: "KsDoc:Schema:delete",
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

module.exports = SchemaController;