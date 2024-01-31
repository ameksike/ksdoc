const _fs = require('fs');
const _fsp = _fs.promises;
const _path = require('path');
const ksdp = require('ksdp');
const utl = require('../utl');

class ContentService extends ksdp.integration.Dip {

    /**
     * @description Document Controller
     * @type {Object|null}
     */
    contentService = null;

    /**
     * @description Document Controller
     * @type {Object|null}
     */
    sessionService = null;

    /**
     * @description Document Controller
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

    async delete({ path, type, id, exts }) {
        let filename = _path.join(path, type, id + exts);
        await _fsp.unlink(filename, { withFileTypes: true });
        return filename;
    }

    async save({ type, path, id, index, content }) {
        let source = _path.join(path, type);
        if (!id) {
            if (!index) {
                let dirs = await _fsp.readdir(source, { withFileTypes: true });
                index = (dirs?.length || 0) + 1;
            }
            index = utl.padSrt(index, 2);
            id = index + "-" + title;
        }
        let filename = _path.join(source, id.replace(/\s/g, "-") + this.exts);
        await _fsp.writeFile(filename, content);
        return filename;
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
        let pageOption = { path: page.path, ext: page.ext };
        let pageData = await this.dataService?.getData({ name: page.name, flow, token });
        let content = await this.tplService.render(page.name, { ...data, ...pageData }, pageOption);
        return content;
    }

    async select(payload) {
        let { pageid, scheme, flow, token, account } = payload || {};
        pageid = pageid || this.template.default;
        let page = this.searchTpl({ pageid, path: this.path.page, scheme });
        const route = { ...this.route, scheme };
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
        let [content, menu] = await Promise.all([
            this.getContent({ pageid, flow, token, page, data }),
            !page.isFragment ? Promise.resolve([]) : this.loadMenu({ scheme, source: this.path.page })
        ]);
        content = content || await this.getContent({ pageid: "main", flow, token, page, data });
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
     * @returns {Array}
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
     * @returns {Object}
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

}

module.exports = ContentService;