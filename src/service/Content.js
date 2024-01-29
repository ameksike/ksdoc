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
        let tpl = utl.interpolate(this.template[pageid], { scheme, root: this.path.root });
        let isFragment = !tpl || /snippet\..*/.test(tpl);
        let ext = !isFragment ? "" : "html";
        return {
            exist: !!tpl,
            isFragment,
            name: tpl ? _path.basename(tpl) : pageid,
            path: tpl ? _path.dirname(tpl) : utl.interpolate(path, { scheme, root: this.path.root }),
            ext
        };
    }

    async getContent({ pageid, flow, token, page, path, scheme }) {
        if (!pageid && page) {
            return '';
        }
        page = page || this.searchTpl({ pageid, path, scheme });
        let pageOption = { path: page.path, ext: page.ext };
        let pageData = await this.dataService?.getData({ name: page.name, flow, token });
        let content = await this.tplService.render(page.name, pageData || {}, pageOption);
        return content;
    }

    async select(payload) {
        let { pageid, scheme, flow, token, account } = payload || {};
        pageid = pageid || this.template.default;
        let page = this.searchTpl({ pageid, path: this.path.page, scheme });
        /*let [content, menu] = await Promise.all(
            this.getContent({ pageid, flow, token, page }),
            !page.isFragment ? Promise.resolve([]) : this.loadMenu({ scheme, source: this.path.page })
        );*/
        let menu = !page.isFragment ? [] : await this.loadMenu({ scheme, source: this.path.page });
        let content = await this.getContent({ pageid, flow, token, page });
        content = content || await this.getContent({ pageid: "main", flow, token, page });

        return !page.isFragment ? content : this.renderLayout({ content, scheme, menu, account, token });
    }

    /**
     * @description build layout page
     * @param {Object} payload 
     * @returns {Promise<String>}
     */
    renderLayout(payload = {}) {
        const { content = "", menu, scheme = "view", account, scripts = "", styles = "", title = "Auth API DOC", token = "" } = payload || {};
        const page = this.searchTpl({ pageid: "layout", path: this.path.page, scheme });
        return this.tplService.render(
            page.name,
            {
                menu,
                title,
                token,
                styles,
                scripts,
                content,
                account: {
                    name: account?.user?.firstName || "Guest"
                },
                url: {
                    access: utl.interpolate(this.route.access, { root: this.route.root }),
                    logout: utl.interpolate(this.route.logout, { root: this.route.root }),
                    home: utl.interpolate(this.route.home, { root: this.route.root, scheme }),
                    api: utl.interpolate(this.route.api, { root: this.route.root, scheme }),
                    src: utl.interpolate(this.route.src, { root: this.route.root, scheme }),
                }
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
            source = _path.resolve(utl.interpolate(source, { scheme, root: this.path.root }));
        }
        return this.loadDir(source, item => {
            let title = item.name.replace(/\.[a-zA-Z0-9]+$/, "").replace(/^\d+\-/, "");
            let url = utl.interpolate(this.route.pag, { root: this.route.root, scheme, page: title });
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