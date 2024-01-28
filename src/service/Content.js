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

    /**
     * 
     * @param {String} source 
     * @returns {{ name: String; description: String}}
     */
    loadTopics(source) {
        return this.getTopics(source, (item, i, source) => {
            let route = typeof source === "string" ? source : _path.join(this.path, item.path);
            return {
                name: item.title || i + 1,
                description: this.tplService.compile(_path.join(route, item.name))
            }
        });
    }

    /**
     * @description laod the main manu
     * @param {String} source 
     * @param {*} [type] 
     * @param {*} [url] 
     * @param {*} [pos] 
     * @returns 
     */
    loadMenu(source, type = null, url = null, pos = "") {
        type = type || this.keys.pages;
        url = url || this.view;
        source = typeof source === "string" ? _path.join(source, type) : source;
        return this.getTopics(source, item => {
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
    getTopics(source, render) {
        const dir = Array.isArray(source) ? source : _fs.readdirSync(source, { withFileTypes: true });
        return dir
            .filter(item => (item.isDirectory && !item.isDirectory()) || !item.isDirectory)
            .map((item, i) => render ? render(item, i, source) : item.name);
    }

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

    searchTpl({ pageid }) {
        let ext = ".html";
        let path = this.template[pageid]
        let file = path || pageid + ext;
        return { file, path };
    }

    async getContent({ pageid, flow, token, path }) {
        if (!pageid) {
            return '';
        }
        this.tplService?.configure({ ext: "", path });
        let pageMeta = this.searchTpl({ pageid });
        let pageOption = { absolute: !!pageMeta.path };
        let pageData = await this.dataService?.getData({ name: pageid, flow, token });
        let content = await this.tplService.render(pageMeta.file, pageData, pageOption);
        return content;
    }

    async select(payload) {
        const { pageid, scheme, flow, token, account } = payload || {};
        let path = _path.join(this.path.root, scheme, this.path.page);

        let content = await this.getContent({ pageid, flow, token, path });
        content = content || await this.getContent({ pageid: "main", flow, token, path });

        let atoken = token ? "?token=" + token : "";
        let topics = this.loadMenu(this.path, this.keys.topics, null, atoken);
        let pages = this.menu?.pages === false ? "" : this.loadMenu(this.path, this.keys?.pages, null, atoken);

        return this.renderLayout({ content, topics, pages, account, token });
    }

    /**
     * @description build layout page
     * @param {Object} payload 
     * @returns {Promise<String>}
     */
    renderLayout(payload = {}) {
        const { content = "", topics, pages, account, scripts = "", styles = "", title = "Auth API Doc" } = payload || {};
        return this.tplService.render(
            _path.join(this.path, this.keys.layout + this.exts),
            {
                content,
                topics,
                pages,
                account: {
                    name: account?.user?.firstName || "Guest"
                },
                url: {
                    logout: this.viewLogout,
                    api: "/doc",
                    src: "/src"
                },
                token,
                scripts,
                styles,
                title
            }
        );
    }

}

module.exports = ContentService;