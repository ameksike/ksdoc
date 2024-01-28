const _fs = require('fs');
const _fsp = fs.promises;
const _path = require('path');
const ksdp = require('ksdp');

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


    searchTpl({ pageid, path }) {
        let ext = ".html";
        let tpl = this.template[pageid];
        return {
            exist: !!tpl,
            name: tpl ? _path.basename(tpl) : pageid,
            path: tpl ? _path.dirname(tpl) : path,
            ext
        };
    }

    async getContent({ pageid, flow, token, path, page }) {
        if (!pageid && page) {
            return '';
        }
        page = page || this.searchTpl({ pageid, path });
        let pageOption = { path: page.path, ext: page.ext };
        let pageData = await this.dataService?.getData({ name: page.name, flow, token });
        let content = await this.tplService.render(page.name, pageData, pageOption);
        return content;
    }

    async select(payload) {
        const { pageid, scheme, flow, token, account } = payload || {};
        let path = _path.join(this.path.root, scheme, this.path.page);
        let page = this.searchTpl({ pageid, path });
        let [content, menu] = await Promise.all(
            this.getContent({ pageid, flow, token, path, page }),
            !pageMeta.exist ? this.loadMenu({ scheme, url: this.route.root }) : Promise.resolve([])
        );
        content = content || await this.getContent({ pageid: "main", flow, token, path });
        return pageMeta.exist ? content : this.renderLayout({ content, scheme, menu, account, token });
    }

    /**
     * @description build layout page
     * @param {Object} payload 
     * @returns {Promise<String>}
     */
    renderLayout(payload = {}) {
        const { content = "", menu, scheme = "view", account, scripts = "", styles = "", title = "Auth API DOC" } = payload || {};
        return this.tplService.render(
            _path.join(this.path, this.keys.layout + this.exts),
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
                    access: this.route.access,
                    logout: this.route.logout,
                    home: this.route.root + "/" + scheme,
                    api: this.route.root + "/" + scheme + this.route.api,
                    src: this.route.root + "/" + scheme + this.route.src
                }
            }
        );
    }

    /**
     * @description laod the main manu
     * @param {String} source 
     * @param {*} [type] 
     * @param {*} [url] 
     * @param {*} [pos] 
     * @returns 
     */
    loadMenu({ scheme, url = null, source, type = null, pos = "" }) {
        type = type || this.keys.pages;

        source = typeof source === "string" ? _path.join(source, type) : source;
        return this.loadFrmFS(source, item => {
            let title = item.name.replace(/\.[a-zA-Z0-9]+$/, "");
            let group = item.group || type;
            return {
                url: `${url}/${group}/${title}` + pos,
                title: title.replace(/^\d+\-/, "")
            };
        });
    }

    /**
     * @description get the list of topics to the menu
     * @param {Array<String>|String} source 
     * @param {Function} [render] 
     * @returns {Object}
     */
    async loadFrmFS(source, render) {
        const dir = Array.isArray(source) ? source : await _fsp.readdir(source, { withFileTypes: true });
        return dir
            .filter(item => (item.isDirectory && !item.isDirectory()) || !item.isDirectory)
            .map((item, i) => render instanceof Function ? render(item, i, source) : item.name);
    }

}

module.exports = ContentService;