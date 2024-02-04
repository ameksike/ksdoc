const _fs = require('fs');
const _fsp = _fs.promises;
const _path = require('path');
const ksdp = require('ksdp');
const utl = require('../utl');

class SchemaService extends ksdp.integration.Dip {

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

    /**
     * @description get the page metadata 
     * @param {Object} payload 
     * @param {String} [payload.pageid] 
     * @param {String} [payload.schema] 
     * @param {String} [payload.path] 
     * @returns {Object} page metadata
     */
    searchTpl(payload) {
        let { pageid, path, schema } = payload || {};
        let route = { ...this.path, schema };
        let tpl = utl.mix(this.template[pageid], route);
        let isFragment = !tpl || /snippet\..*/.test(tpl);
        let ext = !isFragment || !!tpl || /\.(md|twig|html|ejs|tpl)$/i.test(pageid) ? "" : "html";
        return {
            exist: !!tpl,
            isFragment,
            name: tpl ? _path.basename(tpl) : pageid,
            path: tpl ? _path.dirname(tpl) : _path.resolve(utl.mix(path, route) || ""),
            ext
        };
    }

    /**
     * @description get html content 
     * @param {Object} [payload]
     * @param {String} [payload.pageid] 
     * @param {String} [payload.schema] 
     * @param {String} [payload.token] 
     * @param {String} [payload.flow] 
     * @param {String} [payload.path] 
     * @param {Object} [payload.page] 
     * @param {Object} [payload.data] 
     * @param {Object} [payload.lang] 
     * @returns {Promise<String>} html
     */
    async getContent(payload = {}) {
        let { pageid, page, path, schema, lang, data } = payload || {}
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
     * @param {String} [payload.flow] 
     * @param {String} [payload.idm] 
     * @param {String} [payload.token] 
     * @param {Object} [payload.account] 
     * @param {Object} [payload.query] 
     * @param {Object} [payload.dataSrv] 
     * @param {String} [payload.lang] 
     * @returns {Promise<String>} content
     */
    async select(payload) {
        let { pageid = "home", schema, lang: idiom = "en", flow, token, account, query, dataSrv } = payload || {};
        pageid = pageid || this.template.default;
        await this.configService?.load({ schema }, this);

        idiom = idiom || account?.lang || payload?.query?.idiom || "en";
        let page = this.searchTpl({ pageid, path: this.path.page, schema });
        let route = { ...this.route, schema, lang: idiom };

        let [lang, cont, menu] = await Promise.all([
            this.languageService?.load({ path: utl.mix(this.path.lang, { ...this.path, schema }), idiom, schema }),
            dataSrv ? Promise.resolve(dataSrv) : this.dataService?.load({ name: pageid, schema, lang: idiom, flow, token }),
            await this.menuService?.loadDir(this.path.root, {
                onlyDir: true,
                extra: [{ name: "ksdoc", isDirectory: true }],
                filter: (item) => {
                    return !query?.search ? item : new RegExp(".*" + query?.search + ".*", "gi").test(item.name);
                },
                render: async (item) => {
                    let artConf = await this.configService?.load({ schema: item.name });
                    let metadata = artConf?.metadata || { schema: item.name };
                    let delta = Math.abs(Date.now() - parseInt(metadata.date)) / (1000 * 60 * 60 * 24);
                    metadata.schema = item.name;
                    metadata.name = metadata.name || metadata.schema;
                    metadata.group = metadata.group || "community";
                    metadata.url = utl.mix(this.route.home, { ...this.route, schema: item.name, lang: idiom });
                    delta < 11 && (metadata.badge = {
                        class: delta < 5 ? "new" : "hot",
                        title: delta < 5 ? "new" : "hot"
                    });
                    return metadata;
                }
            })
        ]);

        let data = {
            lang,
            token,
            ...query,
            menu,
            account: {
                name: account?.user?.firstName || "Guest"
            },
            url: {
                base: utl.mix(this.route.base, route),
                public: utl.mix(this.route.public, route),
                access: utl.mix(this.route.access, route),
                logout: utl.mix(this.route.logout, route),
                login: utl.mix(this.route.login, route),
            },
            ...cont
        }
        let content = await this.getContent({ schema, lang: idiom, pageid, flow, token, page, data });
        return !page.isFragment ? content : this.renderLayout({ content, schema, account, menu, data });
    }

    /**
     * @description build layout page
     * @param {Object} payload 
     * @returns {Promise<String>}
     */
    renderLayout(payload = {}) {
        const { data, content = "", menu, schema = "view", lang = "en", scripts = "", styles = "", title = "Auth API DOC" } = payload || {};
        const page = this.searchTpl({ pageid: "layout", path: this.path.page, schema });
        const pageOption = this.getBuildOption({ page, schema, force: true, lang });
        return this.tplService.render(
            page.name,
            {
                menu,
                title,
                styles,
                scripts,
                content,
                ...data
            },
            pageOption
        );
    }

    /**
     * @description defines the options to use by the TPL engine
     * @param {Object} payload 
     * @returns {Object} options
     */
    getBuildOption({ schema, lang = "en", page, force }) {
        let cache = null;
        if ((force === undefined || force === false) && this.path?.cache) {
            const cachePath = _path.join(utl.mix(this.path.cache, { ...this.path, schema }), lang);
            cache = { cacheExt: "html", cacheType: "file", cachePath };
        }
        return { path: page.path, ext: page.ext, ...cache };
    }
}

module.exports = SchemaService;