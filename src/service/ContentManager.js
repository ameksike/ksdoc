const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

class ContentManager {

    /**
     * 
     * @param {String} source 
     * @returns {{ name: String; description: String}}
     */
    loadTopics(source) {
        return this.getTopics(source, (item, i, source) => {
            let route = typeof source === "string" ? source : path.join(this.path, item.path);
            return {
                name: item.title || i + 1,
                description: this.tplHandler.compile(path.join(route, item.name))
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
        source = typeof source === "string" ? path.join(source, type) : source;
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
        const dir = Array.isArray(source) ? source : fs.readdirSync(source, { withFileTypes: true });
        return dir
            .filter(item => (item.isDirectory && !item.isDirectory()) || !item.isDirectory)
            .map((item, i) => render ? render(item, i, source) : item.name);
    }

    async delete({ path, type, id, exts }) {
        let filename = path.join(path, type, id + exts);
        await fsp.unlink(filename, { withFileTypes: true });
        return filename;
    }

    async save({ type, path, id, index, content }) {
        let source = path.join(path, type);
        if (!id) {
            if (!index) {
                let dirs = await fsp.readdir(source, { withFileTypes: true });
                index = (dirs?.length || 0) + 1;
            }
            index = utl.padSrt(index, 2);
            id = index + "-" + title;
        }
        let filename = path.join(source, id.replace(/\s/g, "-") + this.exts);
        await fsp.writeFile(filename, content);
        return filename;
    }

    async select({ pageid, typeid, flow, token, account }) {
        let atoken = token ? "?token=" + token : "";

        let content = !pageid ? '' : await this.tplHandler.render(
            path.join(this.path, typeid, pageid + this.exts),
            await this.content.getData({ name: pageid, flow, token })
        );

        content = content || await this.tplHandler.render(
            path.join(this.path, typeid, "../" + this.keys.main + this.exts),
            await this.content.getData({ name: this.keys.main, flow, token })
        ) || "";

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
        return this.tplHandler.render(
            path.join(this.path, this.keys.layout + this.exts),
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

module.exports = ContentManager;