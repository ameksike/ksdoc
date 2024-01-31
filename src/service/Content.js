const _fs = require('fs');
const _fsp = _fs.promises;
const _path = require('path');
const ksdp = require('ksdp');
const utl = require('../utl');

class ContentService extends ksdp.integration.Dip {

    /**
     * @description Content service
     * @type {Object|null}
     */
    contentService = null;

    /**
     * @description Session service
     * @type {Object|null}
     */
    sessionService = null;

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
        let { scheme, filename, extension = "" } = payload || {};
        try {
            let file = _path.join(utl.mix(this.path.page, { ...this.path, scheme }), filename + extension);
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
        let { content, scheme, filename, extension = "" } = payload || {};
        try {
            let file = _path.join(utl.mix(this.path.page, { ...this.path, scheme }), filename + extension);
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

    searchTpl({ pageid, path, scheme }) {
        let route = { ...this.path, scheme };
        let tpl = utl.mix(this.template[pageid], route);
        let isFragment = !tpl || /snippet\..*/.test(tpl);
        let ext = !isFragment || !!tpl || /\.(md|twig|html|ejs|tpl)$/i.test(pageid) ? "" : "html";
        return {
            exist: !!tpl,
            isFragment,
            name: tpl ? _path.basename(tpl) : pageid,
            path: tpl ? _path.dirname(tpl) : utl.mix(path, route),
            ext
        };
    }

    async getContent({ pageid, flow, token, page, path, scheme, data }) {
        if (!pageid && page) {
            return '';
        }
        page = page || this.searchTpl({ pageid, path, scheme });
        let pageOption = this.getBuildOption({ page, scheme });
        let pageData = await this.dataService?.getData({ name: page.name, flow, token });
        let content = await this.tplService.render(page.name, { ...data, ...pageData }, pageOption);
        return content;
    }

    async select(payload) {
        let { pageid, scheme, flow, token, account } = payload || {};
        pageid = pageid || this.template.default;
        await this.loadConfig({ scheme });

        let page = this.searchTpl({ pageid, path: this.path.page, scheme });
        let route = { ...this.route, scheme };
        let lang = await this.languageService?.load({ path: utl.mix(this.path.lang, { ...this.path, scheme }) }) || {};
        let data = {
            lang,
            token,
            account: {
                name: account?.user?.firstName || "Guest"
            },
            url: {
                public: utl.mix(this.route.public, route),
                access: utl.mix(this.route.access, route),
                logout: utl.mix(this.route.logout, route),
                home: utl.mix(this.route.home, route),
                page: utl.mix(this.route.home, route),
                api: utl.mix(this.route.api, route),
                src: utl.mix(this.route.src, route),
            }
        }

        if (this.cfg?.scope !== "public") {
            return this.getContent({ pageid: "404", flow, token, data });
        }
        let [content, menu] = await Promise.all([
            this.getContent({ scheme, pageid, flow, token, page, data }),
            !page.isFragment ? Promise.resolve([]) : this.loadMenu({ scheme, source: this.path.page })
        ]);
        content = content || await this.getContent({ scheme, pageid: "main", flow, token, page, data });
        return !page.isFragment ? content : this.renderLayout({ content, scheme, account, menu, data });
    }

    /**
     * @description build layout page
     * @param {Object} payload 
     * @returns {Promise<String>}
     */
    renderLayout(payload = {}) {
        const { data, content = "", menu, scheme = "view", scripts = "", styles = "", title = "Auth API DOC" } = payload || {};
        const page = this.searchTpl({ pageid: "layout", path: this.path.page, scheme });
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
            { path: page.path, ext: page.ext }
        );
    }

    /**
     * @description load the main menu
     * @param {Object} payload 
     * @returns {Promise<any>}
     */
    loadMenu({ scheme, source }) {
        if (typeof source === "string") {
            source = _path.resolve(utl.mix(source, { ...this.path, scheme, root: this.path.root }));
        }
        return this.loadDir(source, item => {
            let title = item.name.replace(/\.html$/i, "");
            let url = utl.mix(this.route.pag, { ...this.route, scheme, page: title });
            return { url, title };
        });
    }

    /**
     * @description get the list of topics to the menu
     * @param {Array<String>|String} source 
     * @param {Function|null} [render] 
     * @returns {Promise<any>}
     */
    async loadDir(source, render = null) {
        let dir, files, result;
        try {
            dir = Array.isArray(source) ? source : await _fsp.readdir(source, { withFileTypes: true });
            files = dir.filter(item => (item.isDirectory && !item.isDirectory()) || !item.isDirectory);
            result = render instanceof Function ? files.map((item, i) => render(item, i, source)) : files;
        }
        catch (error) {
            result = [];
            this.logger?.error({
                src: "KsDocs:Content:loadDir",
                error
            });
        }
        return result;
    }

    loadConfig({ scheme }) {
        try {
            const pathCore = utl.mix(this.path.core, { ...this.path, scheme });
            const data = require(_path.join(pathCore, "config.json"));
            data?.cfg && Object.assign(this.cfg, data.cfg);
            data?.path && Object.assign(this.path, data.path);
            data?.route && Object.assign(this.route, data.route);
            data?.template && Object.assign(this.template, data.template);
            return Promise.resolve(data);
        }
        catch (_) {
            Promise.resolve({});
        }
    }

    getBuildOption({ scheme, page }) {
        let cache = null;
        if (this.path?.cache) {
            const cachePath = utl.mix(this.path.cache, { ...this.path, scheme })
            cache = { cacheExt: "html", cacheType: "file", cachePath };
        }
        return { path: page.path, ext: page.ext, ...cache };
    }
}

module.exports = ContentService;