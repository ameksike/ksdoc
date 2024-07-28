const _fs = require('fs');
const _fsp = _fs.promises;
const _path = require('path');
const ksdp = require('ksdp');
const utl = require('../utl');

class ContentService extends ksdp.integration.Dip {

    /**
     * @description Config service
     * @type {Object|null}
     */
    configService;

    /**
     * @description Session service
     * @type {Object|null}
     */
    sessionService = null;

    /**
     * @description Menu Service
     * @type {Object|null}
     */
    menuService;

    /**
     * @description Data service
     * @type {Object|null}
     */
    dataService = null;

    /**
     * @description Language service
     * @type {Object|null}
     */
    languageService = null;

    /**
     * @description logger
     * @type {Object|null}
     */
    logger = null;

    /**
     * @description Template engine
     * @type {Object|null}
     */
    tplService = null;

    /**
     * @description all configurations 
     * @type {Object|null}
     */
    cfg = null;

    /**
     * @description all path 
     * @type {Object|null}
     */
    path = null;

    /**
     * @description all routes 
     * @type {Object|null}
     */
    route = null;

    /**
     * @description all templates 
     * @type {Object|null}
     */
    template = null;

    async delete(payload) {
        let { schema, filename, extension = "" } = payload || {};
        try {
            let file = _path.join(utl.mix(this.path.page, { ...this.path, schema }), filename + extension);
            await _fsp.unlink(file); // , { withFileTypes: true }
            return filename;
        }
        catch (error) {
            this.logger?.error({
                src: "KsDocs:Content:loadDir",
                error
            });
            return "";
        }
    }

    async save(payload) {
        let { content, schema, filename, extension = "" } = payload || {};
        try {
            let file = _path.join(utl.mix(this.path.page, { ...this.path, schema }), filename + extension);
            await _fsp.writeFile(file, content);
            return filename;
        }
        catch (error) {
            this.logger?.error({
                src: "KsDocs:Content:loadDir",
                error
            });
            return "";
        }
    }

    searchTpl({ pageid, path, schema }) {
        let route = { ...this.path, schema };
        let tpl = utl.mix(this.template[pageid], route);
        let isFragment = !tpl || /(snippet|README)\..*/i.test(tpl);
        let ext = !isFragment || !!tpl || /\.(md|twig|html|ejs|tpl)$/i.test(pageid) ? "" : "html";
        return {
            exist: !!tpl,
            isFragment,
            name: tpl ? _path.basename(tpl) : pageid,
            path: tpl ? _path.dirname(tpl) : (schema === "ksdoc"
                ? _path.join(__dirname, "../../doc/page")
                : _path.resolve(utl.mix(path, route))),
            ext
        };
    }
    /**
     * @description get html content
     * @param {Object} [payload]
     * @param {String} [payload.pageid]
     * @param {String} [payload.schema]
     * @param {String} [payload.lang]
     * @param {String} [payload.path]
     * @param {Object} [payload.page]
     * @param {Object} [payload.data]
     * @param {String} [payload.flow]
     * @param {String} [payload.token]
     * @returns {Promise<String>} html
     */
    async getContent(payload = {}) {
        let { pageid, page, path, schema, data, lang } = payload || {};
        if (!pageid && page) {
            return '';
        }
        page = page || this.searchTpl({ pageid, path, schema });
        let pageOption = this.getBuildOption({ page, schema, lang });
        let content = await this.tplService.render(page.name, data, pageOption);
        return content;
    }

    /**
     * @description get content to render
     * @param {Object} [payload]
     * @param {String} [payload.pageid]
     * @param {String} [payload.schema] 
     * @param {String} [payload.lang] 
     * @param {String} [payload.flow] 
     * @param {String} [payload.idm] 
     * @param {String} [payload.token] 
     * @param {Object} [payload.account] 
     * @param {Object} [payload.query] 
     * @param {Object} [payload.dataSrv] 
     * @param {Object} [payload.config] 
     * @returns {Promise<String>} content
     */
    async select(payload) {
        let { pageid, schema, flow, token, account, query, dataSrv, config, lang: idiom } = payload || {};
        pageid = pageid || this.template.default;
        config = config || await this.configService?.load({ schema }, this);

        idiom = idiom || account?.lang || payload?.query?.idiom || "en";
        let page = this.searchTpl({ pageid, path: this.path.page, schema });
        let route = { ...this.route, schema, lang: idiom };
        let [lang, cont] = await Promise.all([
            this.languageService?.load({ paths: this.path, schema, idiom }),
            dataSrv ? Promise.resolve(dataSrv) : this.dataService?.load({ name: pageid, schema, flow, token })
        ]);
        let data = {
            global: config?.global,
            title: config?.metadata?.name,
            version: config?.metadata?.version,
            description: config?.metadata?.description,
            environment: process?.env?.NODE_ENV,
            idiom,
            lang,
            token,
            ...query,
            account: account?.user ? {
                name: account?.user?.firstName || "Guest"
            } : null,
            url: {
                public: utl.mix(this.route.public, route),
                access: utl.mix(this.route.access, route),
                logout: utl.mix(this.route.logout, route),
                login: utl.mix(this.route.login, route),
                home: utl.mix(this.route.home, route),
                page: utl.mix(this.route.home, route),
                api: utl.mix(this.route.api, route),
                src: utl.mix(this.route.src, route),
            },
            ...cont
        }

        if (this.cfg?.scope !== "public" && this.cfg?.scope !== undefined) {
            return this.getContent({ pageid: "404", lang: idiom, flow, token, data });
        }
        let [content, menu] = await Promise.all([
            this.getContent({ schema, lang: idiom, pageid, flow, token, page, data }),
            !page.isFragment ? Promise.resolve([]) : this.menuService?.load({ schema, lang: idiom, cfg: config?.cfg, path: this.path, route: this.route })
        ]);
        content = content || await this.getContent({ schema, lang: idiom, pageid: "main", flow, token, page, data });
        return !page.isFragment ? content : this.renderLayout({ content, schema, lang: idiom, account, menu, data });
    }

    /**
     * @description build layout page
     * @param {Object} payload 
     * @returns {Promise<String>}
     */
    renderLayout(payload = {}) {
        const { data, content = "", lang = "en", menu, schema = "view", scripts = "", styles = "" } = payload || {};
        const page = this.searchTpl({ pageid: "layout", path: this.path.page, schema });
        const pageOption = this.getBuildOption({ page, schema, force: true, lang });
        return this.tplService.render(
            page.name,
            {
                menu,
                styles,
                scripts,
                content,
                ...data,
                title: data?.lang?.title || data?.title || "API DOC",
            },
            pageOption
        );
    }

    /**
     * @description defines the options to use by the TPL engine
     * @param {Object} payload 
     * @returns {Object} options
     */
    getBuildOption({ schema, page, force, lang }) {
        let cache = null;
        if ((force === undefined || force === false) && this.path?.cache) {
            const cachePath = _path.join(utl.mix(this.path.cache, { ...this.path, schema }), lang);
            cache = { cacheExt: "html", cacheType: "file", cachePath };
        }
        return { path: page.path, ext: page.ext, ...cache };
    }
}

module.exports = ContentService;